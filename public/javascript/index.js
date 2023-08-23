// Define the recharge amounts as a constant array
const rechargeAmounts = [50, 100, 200, 500, 1000, 1500, 2000, 3000, 4000, 5000, 10000, 50000];

// Create a div element with class "rechargeDiv"
const rechargeDiv = document.createElement('div');
rechargeDiv.classList.add('rechargeDiv');

// Iterate over the rechargeAmounts array
rechargeAmounts.forEach(amount => {
    // Create an h4 element
    const h4 = document.createElement('h4');

    // Set the text content of the h4 element to "NGN {amount}"
    h4.textContent = `NGN ${amount}`;

    // Add the class "recharge-amount" to the h4 element
    h4.classList.add('recharge-amount');

    // Append the h4 element to the rechargeDiv
    rechargeDiv.appendChild(h4);
});

// Add the rechargeDiv at the end of the section
const section = document.querySelector('.choose_amount');
section.appendChild(rechargeDiv);