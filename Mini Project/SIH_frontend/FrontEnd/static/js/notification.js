const unreadMessages = document.querySelectorAll(".unread");
const unread = document.getElementById("notifes");
const markAll = document.getElementById("mark_all");
unread.innerText = unreadMessages.length;


const goBack = () => {
    window.history.back();
  };
// Function to calculate the time difference
function timeAgo(time) {
    const now = new Date();
    const notificationTime = new Date(time);
    const differenceInSeconds = Math.floor((now - notificationTime) / 1000);

    let interval = Math.floor(differenceInSeconds / 31536000);
    if (interval > 1) return interval + " years ago";
    interval = Math.floor(differenceInSeconds / 2592000);
    if (interval > 1) return interval + " months ago";
    interval = Math.floor(differenceInSeconds / 86400);
    if (interval > 1) return interval + " days ago";
    interval = Math.floor(differenceInSeconds / 3600);
    if (interval > 1) return interval + " hours ago";
    interval = Math.floor(differenceInSeconds / 60);
    if (interval > 1) return interval + " minutes ago";
    return Math.floor(differenceInSeconds) + " seconds ago";
}

// Update all notification times dynamically
function updateNotificationTimes() {
    const timeElements = document.querySelectorAll(".time");
    timeElements.forEach((timeElement) => {
        const time = timeElement.getAttribute("data-time");
        timeElement.innerText = timeAgo(time);
    });
}

// Event listeners to mark messages as read
unreadMessages.forEach((message) => {
    message.addEventListener("click", () => {
        message.classList.remove("unread");
        const newUnreadMessages = document.querySelectorAll(".unread");
        unread.innerText = newUnreadMessages.length;
    });
});

markAll.addEventListener("click", () => {
    unreadMessages.forEach(message => message.classList.remove("unread"));
    const newUnreadMessages = document.querySelectorAll(".unread");
    unread.innerText = newUnreadMessages.length;
});

// Call the function to update time spans
updateNotificationTimes();
