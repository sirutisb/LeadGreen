import { toast } from "react-toastify";

export const toastError = (msg) => toast.error(msg, { theme: "colored", closeOnClick: true, closeButton: false, pauseOnHover: false });
export const toastSuccess = (msg) => toast.success(msg, { theme: "colored", closeOnClick: true, closeButton: false, pauseOnHover: false });
export const toastInfo = (msg) => toast.info(msg, { theme: "colored", closeOnClick: true, closeButton: false, pauseOnHover: false });
export const toastWarning = (msg) => toast.warning(msg, { theme: "colored", closeOnClick: true, closeButton: false, pauseOnHover: false });