# Cookie Purchase System
> This is a personal project that allows users to purchase cookies online. Please note that this app doesn't create real purchases.

<br>

## Table of Contents
- [Technologies](#technologies)
- [How to run the project](#how-to-run-project)
- [How to use the app](#how-to-use-app)
- [References](#references)

<br>

## Technologies
* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express
* Database: MySQL

<br>

## <a id="how-to-run-project">How to run the project</a>
### Prerequisites:
- Have a Git and GitHub account
- Have Visual Studio Code or another coding editor

### Configuration instructions:

You will need to install:
- [Node package manager](https://nodejs.org/en/download/) (npm)
- [Xampp](https://www.apachefriends.org/download.html) (comes with MySQL)

Cloning the repository:
- Open Command Prompt 
- `cd` into the folder you want the repository stored in
- Type: `git clone https://github.com/MonB003/Cookie-Purchase-System.git`

In your folder, you will need to install these node packages:
```
npm install express 
npm install express-session 
npm install jsdom 
npm install mysql2
```

### Running the project:
1. Open the Xampp control panel and click ‘Run as administrator’.
2. Click the ‘Start’ button to the right of MySQL to connect to the database.
3. Open Command Prompt
4. `cd` into your project folder
5. Type `node database`
6. Go to http://localhost:8000 on any browser
7. This will direct you to the login page, where you can either login or signup.
8. Once successfully logged in, you will be directed to the main page, where you make purchases.

<br>

## <a id="how-to-use-app">How to use the app</a>
### Make an order:
- After logging in, click the button on the main page that says "Place an Order". Another option is to click the navbar option that says "Order".
- Under the *Cookie Flavours* section, check the box next to the flavour you want. Edit the quantity number for the number of cookies you want.
- Once you have make your selection, click the "Add to Order" button. This will enable the button that allows you to checkout.
- Under the *Your Order* section, your cookie flavour will appear, as well as the total cost for the purchase.
- To make the payment, click the "Checkout" button.

### Make an order payment:
- After clicking the "Checkout" button, you will be redirected to a checkout page with a payment form.
- Fill out all the fields, which include your card number, card expiry date, and cvv. Your name and email are automatically filled based your account information in the database.
- When all fields have been filled with valid information, click the "Pay" button.
- A small thank you popup message will appear. To close it, click the "Ok" button. After, you will be directed back to the main page.

### Write a review:
- From the main page, click the "Write a Review" button.
- You will be directed to a page with a review form.
- The required fields that must be filled out include:
  - Name
  - What your order was
  - Rating from excellent to bad for certain categories
- You can provide feedback about any improvements or comments you have. 
- You can check off the box if you would recommend this system to others.
- Once all the required fields are filled with valid information, click the "Submit" button.
- A small popup message will appear. After clicking the "Ok" button, you will be directed back to the main page.

<br>

## <a id="references">References</a>
- [Fetch API tutorial](https://www.youtube.com/watch?v=Kw5tC5nQMRY)
- [Gradient CSS background](https://codepen.io/P1N2O/pen/pyBNzX)
- [Create and write to text file (Time: 32:20)](https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=2604s)
- [Date and time object](https://tecadmin.net/get-current-date-time-javascript/)
