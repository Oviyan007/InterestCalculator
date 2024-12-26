const remainderList = []; // Array to store remainders

// Calculate Interest
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

// Set Remainder
document.getElementById("setRemainder").addEventListener("click", function () {
    const borrower = document.getElementById("borrower").value.trim();
    const dueDate = new Date(document.getElementById("dueDate").value);

    if (!borrower) {
        alert("Please enter the borrower's name.");
        return;
    }

    if (isNaN(dueDate)) {
        alert("Please select a valid due date.");
        return;
    }

    const now = new Date();
    const timeUntilDue = dueDate.getTime() - now.getTime();

    if (timeUntilDue <= 0) {
        alert("The due date must be in the future!");
        return;
    }

    // Add remainder to the list
    remainderList.push({ borrower, dueDate });
    updateRemainderList();

    // Set notification
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                setTimeout(() => {
                    new Notification("Remainder Alert", {
                        body: `Remainder for ${borrower}: Due date is today (${dueDate.toDateString()}).`,
                        icon: "percentage.png" // Replace with your app icon
                    });
                }, timeUntilDue);

                alert("Remainder has been set!");
            } else {
                alert("Notifications are blocked. Please enable them in your browser settings.");
            }
        });
    } else {
        alert("Notifications are not supported in this browser.");
    }
});

// Update Remainder List
function updateRemainderList() {
    const listElement = document.getElementById("remainderList");
    listElement.innerHTML = ""; // Clear existing list

    remainderList.forEach(({ borrower, dueDate }, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${borrower}</strong> - Due on: ${new Date(dueDate).toDateString()}
            <button onclick="removeRemainder(${index})">Remove</button>
        `;
        listElement.appendChild(listItem);
    });
}

// Remove Remainder
function removeRemainder(index) {
    remainderList.splice(index, 1);
    updateRemainderList();
}
