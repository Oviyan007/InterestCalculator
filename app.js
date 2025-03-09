const remainderListKey = "remainderList";
let remainderList = loadRemainders(); // Load saved remainders from localStorage

// Calculate Interest
document.getElementById("calculate").addEventListener("click", function () {
    const amount = parseFloat(document.getElementById("amount").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const time = parseFloat(document.getElementById("time").value);

    if (!amount || !rate || !time || amount <= 0 || rate <= 0 || time <= 0) {
        alert("Please enter valid values for all fields!");
        return;
    }

    // Correct the formula by dividing the rate by 100
    const interest = (amount * (rate / 100) * time);
    console.log(rate/100);
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
    dueDate.setHours(11, 10, 0); // Example: Notification at 9 AM


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
    saveRemainders(); // Save updated list to localStorage
    updateRemainderList();

    // Set notification
   if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
        if (Notification.permission === "granted") {
            setTimeout(() => {
                registration.showNotification("Reminder Alert", {
                    body: `Reminder for ${borrower}: Due date is today (${dueDate.toDateString()}).`,
                    icon: "/icon-192x192.png" // Ensure this file exists
                });
            }, timeUntilDue);
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    registration.showNotification("Reminder Alert", {
                        body: `Reminder for ${borrower}: Due date is today (${dueDate.toDateString()}).`,
                        icon: "/icon-192x192.png"
                    });
                } else {
                    alert("Notifications are blocked. Please enable them.");
                }
            });
        }
    });
} else {
    alert("Service Worker not supported.");
}

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
    saveRemainders(); // Save updated list to localStorage
    updateRemainderList();
}

// Save Remainders to localStorage
function saveRemainders() {
    localStorage.setItem(remainderListKey, JSON.stringify(remainderList));
}

// Load Remainders from localStorage
function loadRemainders() {
    const savedRemainders = localStorage.getItem(remainderListKey);
    return savedRemainders ? JSON.parse(savedRemainders) : [];
}

// Initialize the app
updateRemainderList();
