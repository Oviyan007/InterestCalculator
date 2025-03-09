const remainderListKey = "remainderList";
let remainderList = loadRemainders(); // Load saved remainders from localStorage

// Function to Play Notification Sound
function playNotificationSound() {
    const audio = new Audio("/notification.wav"); // Ensure this file exists
    audio.play().then(() => {
        console.log("Notification sound played successfully.");
    }).catch(error => {
        console.error("Error playing sound:", error);
    });
}


// Calculate Interest
document.getElementById("calculate").addEventListener("click", function () {
    const amount = parseFloat(document.getElementById("amount").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const time = parseFloat(document.getElementById("time").value);

    if (!amount || !rate || !time || amount <= 0 || rate <= 0 || time <= 0) {
        alert("Please enter valid values for all fields!");
        return;
    }

    const interest = (amount * (rate / 100) * time);
    const totalAmount = amount + interest;

    document.getElementById("result").innerHTML = `
        Interest: ₹${interest.toFixed(2)}<br>
        Total Amount: ₹${totalAmount.toFixed(2)}
    `;
});

// Set Reminder
document.getElementById("setRemainder").addEventListener("click", function () {
    const borrower = document.getElementById("borrower").value.trim();
    const dueDate = new Date(document.getElementById("dueDate").value);
    dueDate.setHours(11, 10, 0); // Example: Notification at 11:10 AM

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

    // Add reminder to the list
    remainderList.push({ borrower, dueDate });
    saveRemainders(); // Save updated list to localStorage

    // Set Notification
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            if (Notification.permission === "granted") {
                setTimeout(() => {
                    registration.showNotification("Reminder Alert", {
                        body: `Reminder for ${borrower}: Due date is today (${dueDate.toDateString()}).`,
                        icon: "/percentage.png"
                    });

                    // Play sound when notification appears
                    playNotificationSound();
                }, timeUntilDue);
            } else {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        registration.showNotification("Reminder Alert", {
                            body: `Reminder for ${borrower}: Due date is today (${dueDate.toDateString()}).`,
                            icon: "/percentage.png"
                        });

                        // Play sound
                        playNotificationSound();
                    } else {
                        alert("Notifications are blocked. Please enable them.");
                    }
                });
            }
        });
    } else {
        alert("Service Worker not supported.");
    }

    updateRemainderList(); // Update the UI
});

// Update Reminder List
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

// Remove Reminder
function removeRemainder(index) {
    remainderList.splice(index, 1);
    saveRemainders(); // Save updated list to localStorage
    updateRemainderList();
}

// Save Reminders to localStorage
function saveRemainders() {
    localStorage.setItem(remainderListKey, JSON.stringify(remainderList));
}

// Load Reminders from localStorage
function loadRemainders() {
    const savedRemainders = localStorage.getItem(remainderListKey);
    return savedRemainders ? JSON.parse(savedRemainders) : [];
}

// Initialize the app
updateRemainderList();
