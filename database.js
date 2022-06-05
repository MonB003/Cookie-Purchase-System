// Requires
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require('jsdom');
const path = require('path');

// Static paths
app.use('/scripts', express.static('./scripts'));
app.use('/styles', express.static('./styles'));
app.use('/images', express.static('./images'));

// MySQL Connection
const mysql = require("mysql2");
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "cookiesystem",
    multipleStatements: true
});

// Session details
app.use(session({
    secret: "sacinom terces",
    name: "cookiesystemSessionID",
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// Home page on localhost:8000
app.get('/', function (req, res) {

    if (req.session.loggedIn) {
        res.redirect("/main");

    } else {
        let doc = fs.readFileSync("./login.html", "utf8");

        res.set("Server", "Monicode Engine");
        res.set("X-Powered-By", "Monicode");
        res.send(doc);
    }
});


// Main page
app.get("/main", function (req, res) {

    // Check for a session first
    if (req.session.loggedIn) {
        let main = fs.readFileSync("./main.html", "utf8");
        let mainDOM = new JSDOM(main);

        // Get the user's data and put it into the page
        mainDOM.window.document.getElementById("customerName").innerHTML = "Welcome, " + req.session.firstName +
            " " + req.session.lastName + "!";

        res.set("Server", "Monicode Engine");
        res.set("X-Powered-By", "Monicode");
        res.send(mainDOM.serialize());

    } else {
        // Not logged in, so direct to home page
        res.redirect("/");
    }

});


// When a user tries to login
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    verifyAccount(req.body.email, req.body.password,
        function (userRecord) {
            if (userRecord == null) {
                // User login in unsuccessful
                res.send({
                    status: "fail",
                    msg: "Account not found."
                });

            } else {
                // If user successfully logged in, create a session, store their data in the session
                req.session.loggedIn = true;
                req.session.email = userRecord.email;
                req.session.password = userRecord.password;
                req.session.firstName = userRecord.firstName;
                req.session.lastName = userRecord.lastName;
                req.session.birthday = userRecord.birthday;

                req.session.save(function (err) {
                    // session saved
                });

                // Send message saying user's login was successful
                res.send({
                    status: "success",
                    msg: "Logged in."
                });
            }
        });
});


// When a user logs out
app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Cannot log out");
            } else {
                // Session deleted, redirect to home page
                res.redirect("/");
            }
        });
    }
});


// Signup page
app.get("/signup", function (req, res) {
    let signup = fs.readFileSync("./account.html", "utf8");
    let signupDOM = new JSDOM(signup);

    res.set("Server", "Monicode Engine");
    res.set("X-Powered-By", "Monicode");
    res.send(signupDOM.serialize());
});


// When a user signs up
app.post("/signup", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    checkExistingEmail(req.body.email,
        function (userRecord) {

            // When checkExistingEmail() returns null because user isn't currently in database
            if (userRecord == null) {
                // Create a session, store their data in the session
                req.session.loggedIn = true;
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.firstName = req.body.firstName;
                req.session.lastName = req.body.lastName;
                req.session.birthday = req.body.birthday;

                let newUser = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    birthday: req.body.birthday,
                    email: req.body.email,
                    password: req.body.password
                };

                // ? is placeholder for data being inserted
                let sql = `INSERT INTO users SET ?`
                connection.query(sql, newUser, (err, result) => {
                    if (err) throw err;
                });

                req.session.save(function (err) {
                    // Session saved
                });

                // Send message saying user's login was successful
                res.send({
                    status: "success",
                    msg: "Logged in."
                });
            } else {

                // Send message saying account already exists
                res.send({
                    status: "fail",
                    msg: "Account already exists with this email."
                });
            }
        });
});


// Order page
app.get("/order", function (req, res) {
    if (req.session.loggedIn) {
        let order = fs.readFileSync("./order.html", "utf8");
        let orderDOM = new JSDOM(order);

        // Autofill user's name
        orderDOM.window.document.getElementById("email").defaultValue = req.session.email;

        res.send(orderDOM.serialize());

    } else {
        res.redirect("/");
    }
});


// Variables to store order details
var storeCookies;
var storeQuantity;
var storeCost;
var storeDate;

// When a user places an order
app.post("/order", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    storeCookies = req.body.cookies;
    storeQuantity = req.body.quantity;
    storeCost = req.body.cost;

    saveOrder(req.body.email,
        function (userRecord) {

            // When saveOrder() returns a user in the db
            if (userRecord != null) {
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateAndTime = date + ' ' + time;
                storeDate = dateAndTime;

                let newOrder = {
                    cookies: req.body.cookies,
                    cost: req.body.cost,
                    quantity: req.body.quantity,
                    time: dateAndTime,
                    customerEmail: req.body.email
                };

                // ? is placeholder for data being inserted
                let sql = `INSERT INTO orders SET ?`
                connection.query(sql, newOrder, (err, result) => {
                    if (err) throw err;
                });

                req.session.save(function (err) {
                    // session saved
                });

                // Send message saying user's order was placed successfully
                res.send({
                    status: "success",
                    msg: "Your order has been placed. Thank you for buying from MBsCookies!"
                });

            } else {
                // Send message saying account already exists
                res.send({
                    status: "fail",
                    msg: "User account wasn't found. Order can't be processed"
                });
            }
        });
});


// Payment page
app.get("/checkout", function (req, res) {
    if (req.session.loggedIn) {
        let checkout = fs.readFileSync("./checkout.html", "utf8");
        let checkoutDOM = new JSDOM(checkout);

        // Autofill info with session name and email
        checkoutDOM.window.document.getElementById("userName").defaultValue = req.session.firstName;
        checkoutDOM.window.document.getElementById("userEmail").defaultValue = req.session.email;

        res.send(checkoutDOM.serialize());

    } else {
        res.redirect("/");
    }
});


// When a user completes an order and pays
app.post("/checkout", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    makePayment(req.body.userName, req.body.userEmail,
        function (userRecord) {

            // When makePayment() returns a user in the db
            if (userRecord != null) {

                // Append order info to receipts text file
                // If text file doesn't exist, it will be created
                fs.appendFile(path.join(__dirname, '/payments', 'receipts.txt'),
                    '\nORDER ' + '\n' + '\nDate: ' + storeDate + '\n' +
                    '\nCustomer Name: ' + req.body.userName + '\nEmail: ' + req.body.userEmail +
                    '\n' + '\nCOOKIES' + '\nFlavour(s): ' + storeCookies + '\nQuantity: ' + storeQuantity + '\n' +
                    '\SUBTOTAL: $' + storeCost + '\n' + '\nCard Info: ' + '\n' + req.body.cardNum +
                    '\nExpires: ' + req.body.expiryMonth + ' ' + req.body.expiryYear + '\nCVV: ' + req.body.cardCvv +
                    '\n' + '-----------------------------------------' + '\n', err => {
                        if (err) throw err;
                    });

                req.session.save(function (err) {
                    // Session saved
                });

                // Send message 
                res.send({
                    status: "success",
                    msg: "Your payment was successful. Thank you for buying from MBsCookies!"
                });

            } else {

                res.send({
                    status: "fail",
                    msg: "Email account wasn't found. Payment can't be processed"
                });
            }
        });
});


// Write a review page
app.get("/review", function (req, res) {
    if (req.session.loggedIn) {
        let review = fs.readFileSync("./review.html", "utf8");
        let reviewDOM = new JSDOM(review);
        
        // Autofill info with session name
        reviewDOM.window.document.getElementById("name").defaultValue = req.session.firstName;

        res.send(reviewDOM.serialize());

    } else {
        res.redirect("/");
    }
});


// When a user writes a review
app.post("/review", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    let finalRating = req.body.rating;

    let reviewData = new Array();
    reviewData.push(req.body.name);
    reviewData.push(req.body.email);
    reviewData.push(req.body.userOrder);
    reviewData.push(req.body.improvements);
    reviewData.push(req.body.comments);
    reviewData.push(req.body.recommend);

    for (index = 0; index < reviewData.length; index++) {
        let currData = reviewData[index];

        if (currData == "" || currData == "N/A") {
            reviewData[index] = null;
        }
    }

    reviewData[5] = (req.body.recommend == true ? "Yes" : "No");

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateAndTime = date + ' ' + time;
    storeDate = dateAndTime;

    let newReview = {
        name: reviewData[0],
        email: reviewData[1],
        orderDetails: reviewData[2],
        rating: finalRating,
        feedback: reviewData[3],
        comments: reviewData[4],
        recommend: reviewData[5],
        time: dateAndTime
    };

    // ? is placeholder for data being inserted
    let sql = `INSERT INTO reviews SET ?`
    connection.query(sql, newReview, (err, result) => {
        if (err) throw err;
    });

    req.session.save(function (err) {
        // session saved
    });

    // Send message saying user's review was submitted
    res.send({
        status: "success",
        msg: "Your review has been submitted. We appreciate you taking the time to give us feedback!"
    });
});


// Checks that email and password combination exist as a user in the database
function verifyAccount(email, pwd, callback) {
    connection.query(
        "SELECT * FROM users WHERE email = ? AND password = ?", [email, pwd],
        function (error, results) {
            if (error) {}
            if (results.length > 0) {
                // email and password found
                return callback(results[0]);
            } else {
                // user not found
                return callback(null);
            }
        }
    );
}


// Checks that email exists as a user in the database
function checkExistingEmail(email, callback) {
    connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        function (error, results) {
            if (error) {}
            if (results.length > 0) {
                // email exists in database
                return callback(results[0]);
            } else {
                // email does not exist
                return callback(null);
            }
        }
    );
}


// Get user's email for order
function saveOrder(email, callback) {
    connection.query(
        "SELECT * FROM users WHERE email = ?", [email],
        function (error, results) {

            if (error) {}
            if (results.length > 0) {
                // user's name found
                return callback(results[0]);
            } else {
                // user not found
                return callback(null);
            }
        }
    );
}


// Get user's name and email for payment
function makePayment(name, email, callback) {
    connection.query(
        "SELECT * FROM users WHERE firstName = ? AND email = ?", [name, email],
        function (error, results) {

            if (error) {}
            if (results.length > 0) {
                // user's email found
                return callback(results[0]);
            } else {
                // user not found
                return callback(null);
            }
        }
    );
}


/*
 * Connects to the MySQL database 
 * Checks if the database exists
 * If it doesn't exist, it is created and has default user account
 */
async function databaseSetup() {
    // Promise
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });
    // Setup database and tables
    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS cookiesystem;
        use cookiesystem;
        CREATE TABLE IF NOT EXISTS users(
        id int NOT NULL AUTO_INCREMENT, 
        firstName VARCHAR(20), 
        lastName VARCHAR(20), 
        birthday DATE, 
        email VARCHAR(30), 
        password VARCHAR(30), 
        PRIMARY KEY (id));
        
        CREATE TABLE IF NOT EXISTS orders(
            orderID INT NOT NULL AUTO_INCREMENT, 
            customerEmail VARCHAR(30) NOT NULL,
            cookies VARCHAR(150) NOT NULL,
            cost DECIMAL(6, 2) NOT NULL,
            quantity INT NOT NULL,
            time TIMESTAMP NOT NULL,
            PRIMARY KEY (orderID));

        CREATE TABLE IF NOT EXISTS reviews(
            reviewNumber INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(20) NOT NULL,
            email VARCHAR(30),
            orderDetails VARCHAR(50) NOT NULL,
            rating DECIMAL(3, 2) NOT NULL,
            feedback VARCHAR(500),
            comments VARCHAR(500),
            recommend VARCHAR(5),
            time TIMESTAMP NOT NULL,
            PRIMARY KEY(reviewNumber))`;
    await connection.query(createDBAndTables);

    // Wait for query result
    const [rows] = await connection.query("SELECT * FROM users");

    // If there's no records, add some
    if (rows.length == 0) {
        let userRecords = "INSERT INTO users (firstName, lastName, birthday, email, password) VALUES ?";
        let recordValues = [
            ["Sally", "Baker", "2022-01-01", "sallyb@test.ca", "password"]
        ];
        await connection.query(userRecords, [recordValues]);
    }

    console.log("Listening on port " + port + "!");
}

// Run server on port 8000
let port = 8000;
app.listen(port, databaseSetup);