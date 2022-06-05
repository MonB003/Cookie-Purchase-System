// When signup button is clicked
async function signup() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let birthday = document.getElementById("birthday").value;
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassword").value;

    const dataSent = {
        firstName,
        lastName,
        birthday,
        email,
        password
    };

    // Details for post request
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    if (containsEmptyFields()) {
        document.getElementById("errorMsg").innerHTML = "Please fill out all fields.";

    } else {
        // Get response from server side post request
        const postResponse = await fetch('/signup', postDetails);
        const jsonData = await postResponse.json();

        if (jsonData.status == "success") {
            window.location.replace("/main");
        } else {
            document.getElementById("errorMsg").innerHTML = jsonData.msg;
            document.getElementById("userEmail").style.borderColor = "red";
        }
    }
};


// Checks if any of the text fields are empty before user tries to sign up
function containsEmptyFields() {
    let formInputs = document.getElementById("signUpForm").getElementsByTagName("input");
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
}