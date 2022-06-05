// After user enters payment details, check validation and submit payment
async function payAndCheckout() {
    let user_name = document.getElementById('userName');
    let user_email = document.getElementById('userEmail');
    let card_num = document.getElementById('cardNum');
    let expiryMonthSelect = document.getElementById('expiryMonth');
    // Get month from dropdown menu
    let expiry_month = expiryMonthSelect.options[expiryMonthSelect.selectedIndex].text;
    let expiry_year = document.getElementById('expiryYear');
    let card_cvv = document.getElementById('cardCvv');

    // Month selected from dropdown menu as a number
    let selectedMonth = getSelectedMonth(expiry_month);

    // Get current date
    // Store current month and year which will be used to validate credit card expiration info
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Converts year to an integer
    let convertYear = parseInt(expiry_year.value);


    // Check special cases
    if (containsEmptyFields()) {
        // If input field is empty
        document.getElementById("payErrorMsg").innerHTML = "Please fill out all fields";

    } else if (selectedMonth <= currentMonth && convertYear == currentYear) {
        // If card expires this year, compare the selected month with the current month to see if it's expired
        document.getElementById("payErrorMsg").innerHTML = "Card is expired";
        expiryMonthSelect.style.borderColor = "red";
        expiry_year.style.borderColor = "red";

    } else if (convertYear < currentYear || expiry_year.value.length != 4) {
        // Invalid year (expired or wrong number of digits)
        e.preventDefault();
        document.getElementById("payErrorMsg").innerHTML = "Card expiry year must be valid and 4 digits";
        expiry_year.style.borderColor = "red";
        expiryMonthSelect.style.borderColor = "black";

    } else if (card_cvv.value.length != 3) {
        // Invalid CVV
        document.getElementById("payErrorMsg").innerHTML = "CVV must be 3 digits";
        card_cvv.style.borderColor = "red";
        expiryMonthSelect.style.borderColor = "black";

    } else {
        // If all input is valid, send to Post Checkout method
        sendDataToServer(user_name, user_email, card_num, expiry_month, expiry_year, card_cvv);
    }
};


// Checks if any of the text fields are empty before user tries to checkout
function containsEmptyFields() {
    let formInputs = document.getElementById("paymentForm").getElementsByTagName("input");
    let checkEmptyInput = false;

    // Check for empty input fields
    for (i = 0; i < formInputs.length; i++) {
        let currInput = formInputs[i];

        if (currInput.value == "") {
            checkEmptyInput = true;
            currInput.style.borderColor = "red";

        } else {
            currInput.style.borderColor = "black";
        }
    }

    return checkEmptyInput;
};


// Gets the dropdown month and converts its value to the corresponding numeric month based on the array
function getSelectedMonth(expiry_month) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let selectedMonth = 0;
    // Checks the current month
    for (m = 0; m < months.length; m++) {

        if (expiry_month == months[m]) {
            // Save index of current month
            selectedMonth = m;
        }
    }

    return selectedMonth;
}


// Sends input to post request
async function sendDataToServer(user_name, user_email, card_num, expiry_month, expiry_year, card_cvv) {
    let userName = user_name.value;
    let userEmail = user_email.value;
    let cardNum = card_num.value;
    let expiryMonth = expiry_month;
    let expiryYear = expiry_year.value;
    let cardCvv = card_cvv.value;

    const dataSent = {
        userName,
        userEmail,
        cardNum,
        expiryMonth,
        expiryYear,
        cardCvv
    };

    // Details for post request
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    // Get response from server side post request
    const postResponse = await fetch('/checkout', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "success") {
        alert(jsonData.msg);
        window.location.replace("/main");
    } else {
        document.getElementById("payErrorMsg").innerHTML = jsonData.msg;
    }
}