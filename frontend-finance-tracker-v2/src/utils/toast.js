import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccess = (msg) =>
    toast.success(msg, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
    });

export const showLogout = (msg) =>
    toast.info(msg, {
        position: "top-right",
        autoClose: 3000,
        style: { backgroundColor: "#808080", color: "white" },
        theme: "colored",
    });

export const showWarning = (msg) =>
    toast.warn(msg, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
    });

export const showError = (msg) =>
    toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
    });
