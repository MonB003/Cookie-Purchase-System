// Class represents a cookie
class Cookie {

    // Constructor for a cookie object
    constructor(flavour, quantity, price, arrIndex) {
        this.flavour = flavour;
        this.quantity = quantity;
        this.price = price;
        this.arrIndex = arrIndex;
    }
}

// User's order total
var totalCost = 0;
var cookiePrice = 3;
var numOfItems = 0;

var flavoursArray = new Array();
var flavourSelected = false;

// Gets the checkbox values that are selected
function flavoursChecked() {
    var childInputs = document.getElementById("flavoursDiv").getElementsByTagName("input");
    var temp = new Array();

    // Check if a flavour checkbox is selected and adds it to temp array if it is
    for (i = 0; i < childInputs.length; i++) {
        var currInput = childInputs[i];

        if (currInput.checked) {
            temp.push(currInput.value);

            flavourSelected = true;
        }
    }

    if (flavourSelected) {
        flavoursArray = temp;
        document.getElementById("cookiesArray").innerHTML = flavoursArray;
        
    } else {
        // Nothing was selected
        document.getElementById("cookiesArray").innerHTML = "Empty";
    }
}

// Calculates the price
function calculate() {
    // Get quantity
    let quantity = document.getElementById("quantity").value;

    // Convert quantity text into an integer so it can be used for counting/adding
    let convertQuant = parseInt(quantity);

    // Count items
    if (flavourSelected) {
        numOfItems += convertQuant;

    } else {
        // If item count is 0, order is empty
        numOfItems = 0;
        convertQuant = 0;
    }

    // Update price
    totalCost += (cookiePrice * convertQuant);

    // Display price on the page
    document.getElementById("subtotal").innerHTML = totalCost;

    // Reset boolean checker
    flavourSelected = false;
}

function prepOrderInfo() {
    // Call helper methods
    flavoursChecked();
    calculate();

    if (totalCost != 0) {
        document.getElementById("checkoutBtn").disabled = false;
    } else {
        document.getElementById("checkoutBtn").disabled = true;
    }

    // Reset order
    numOfItems = 0;
    totalCost = 0;
}