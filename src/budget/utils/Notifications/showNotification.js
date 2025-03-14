import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

let maxNotifications = 1; 
let notificationCount = 0;

const showNotifiaction = (message, type) => {

    if (notificationCount < maxNotifications) {
        notificationCount++;

        Toastify({
            text: message,
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                boxShadow: 'none',
                background: type === "success" ? "#009933" : "#cc0000",
                color: "white",
            },
        }).showToast();

        setTimeout(() => {
            notificationCount--; 
        }, 2000);
    }
};

export default showNotifiaction;