// When checkout button is clicked
async function placeOrder() {
    let email = document.getElementById("email").value;
    let quantity = document.getElementById("quantity").value;
    let cost = document.getElementById("subtotal").textContent;
    let cookies = document.getElementById("cookiesArray").textContent;

    const dataSent = {
        email,
        quantity,
        cost,
        cookies
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
    const postResponse = await fetch('/order', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "success") {
        window.location.replace("/checkout");
    } 
};