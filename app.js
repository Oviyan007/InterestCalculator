document.getElementById("calculate").addEventListener("click", function () {
    const amount = parseFloat(document.getElementById("amount").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const time = parseFloat(document.getElementById("time").value);

    if (!amount || !rate || !time || amount <= 0 || rate <= 0 || time <= 0) {
        alert("Please enter valid values for all fields!");
        return;
    }

    const interest = (amount * rate * time) / 100;
    const totalAmount = amount + interest;

    document.getElementById("result").innerHTML = `
        Interest: ₹${interest.toFixed(2)}<br>
        Total Amount: ₹${totalAmount.toFixed(2)}
    `;
});
