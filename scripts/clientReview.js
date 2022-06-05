// When a review is completed and submitted
async function submitReview() {
    let user_name = document.getElementById('name');
    let user_email = document.getElementById('email');
    let user_order = document.getElementById('userOrder');

    let improvements = document.getElementById('improvements');
    let comments = document.getElementById('comments');
    let recommend = document.getElementById('recommend');
    let recommendCheck = recommend.checked;

    // Get values of non required fields
    let validEmail = ((user_email.value == null || user_email.value == "") ? "N/A" : user_email.value);
    let validImprovements = getTextAreaValue(improvements);
    let validComments = getTextAreaValue(comments);

    // Calculate sum of radio field rating values
    let sum = calculateSum();
    // Calculate average of all the ratings
    let finalAverage = calculateFinalAverage(sum);

    // Check if any required input fields are empty before submitting review
    if (containsEmptyFields()) {
        document.getElementById("reviewErrMsg").innerHTML = "Please fill out all required fields.";

    } else {
        // Send to Post Review method
        sendDataToServer(user_name, validEmail, user_order, validImprovements, validComments, recommendCheck, finalAverage);
    }
};


// Checks if any of the required text fields are empty before user submits a review
function containsEmptyFields() {
    let formInputText = document.querySelectorAll('input[type="text"]');
    let checkEmptyInput = false;

    // Check for empty required input fields
    for (i = 0; i < formInputText.length; i++) {
        let currInput = formInputText[i];

        if (currInput.value == "") {
            checkEmptyInput = true;
            currInput.style.borderColor = "red";

        } else {
            currInput.style.borderColor = "black";
        }
    }

    return checkEmptyInput;
};


// Gets appropriate string value of the textarea field
function getTextAreaValue(input) {
    let validValue = "";

    if (input == null) {
        validValue = "N/A";
    } else {
        validValue = input.value;
    }

    return validValue;
};


// Calculates the sum of the radio button values
function calculateSum() {
    const reviewRadios = document.querySelectorAll('input[type="radio"]');
    let sum = 0;
    let array = new Array();

    // Checks if each radio button is selected
    for (const radioBtn of reviewRadios) {
        if (radioBtn.checked) {
            let currRadio = radioBtn.value;
            array.push(radioBtn.id);

            // If radio button is selected, add it's corresponding number value (1-5) to the sum
            switch (currRadio) {
                case "Excellent":
                    sum += 5;
                    break;
                case "Good":
                    sum += 4;
                    break;
                case "Bad":
                    sum += 2;
                    break;
                case "Extremely Bad":
                    sum += 1;
                    break;
                default: // Adequate
                    sum += 3;
                    break;
            }
        }
    }

    return sum;
};


// Calculates the final average of the sum
function calculateFinalAverage(sum) {
    // Calculate average of all the ratings
    let reviewAverage = sum / 6;

    let averageHasDec = sum % 6 != 0;
    let finalAverage = 0;

    // If average is a decimal, round to 2 decimal places
    if (averageHasDec) {
        let roundAvg = reviewAverage.toFixed(2);
        finalAverage = roundAvg;
    } else {
        finalAverage = reviewAverage;
    }

    return finalAverage;
};


// Sends input to post request
async function sendDataToServer(user_name, validEmail, user_order, validImprovements, validComments, recommendCheck, finalAverage) {
    let name = user_name.value;
    let email = validEmail;
    let userOrder = user_order.value;
    let improvements = validImprovements;
    let comments = validComments;
    let recommend = recommendCheck;
    let rating = finalAverage;

    const dataSent = {
        name,
        email,
        userOrder,
        improvements,
        comments,
        recommend,
        rating
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
    const postResponse = await fetch('/review', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "success") {
        alert(jsonData.msg);
        window.location.replace("/main");
    } else {
        document.getElementById("reviewErrMsg").innerHTML = jsonData.msg;
    }
};