import bootstrap from "../../../public/scripts/bootstrap.bundle.min.js"

export class ToastController {

    public static addToast(text: string, toastType?: ToastType, stayOpen?: boolean) {
        const toastContainer = document.getElementById("toast-parent");

        // Create Toast HTML Elements
        let toastElement = document.createElement("div");
        toastElement.classList.add("toast");

        let toastBody = document.createElement("div");
        toastBody.classList.add("toast-body");

        let toastContent = document.createElement("div");
        toastContent.innerText = text;

        let buttonClose = document.createElement("button");
        buttonClose.type = "button";
        buttonClose.classList.add("btn-close");
        buttonClose.setAttribute("data-bs-dismiss", "toast");
        buttonClose.setAttribute("aria-label", "Close");

        // Change Toast type
        switch (toastType) {
            case ToastType.PRIMARY: {
                toastElement.classList.add("bg-primary", "text-white");
                toastBody.classList.add("bg-primary", "text-white");
                buttonClose.classList.add("btn-close-white");
                break;
            }
            case ToastType.DANGER: {
                toastElement.classList.add("bg-danger", "text-white");
                toastBody.classList.add("bg-danger", "text-white");
                buttonClose.classList.add("btn-close-white");
                break;
            }
            case ToastType.SUCESS: {
                toastElement.classList.add("bg-success", "text-white");
                toastBody.classList.add("bg-success", "text-white");
                buttonClose.classList.add("btn-close-white");
                break;
            }
            case ToastType.WARNING: {
                toastElement.classList.add("bg-warning");
                toastBody.classList.add("bg-warning");
                break;
            }
        }

        // Build the Toast
        toastElement.appendChild(toastBody);
        toastBody.appendChild(toastContent);
        toastBody.appendChild(buttonClose);
        toastContainer.appendChild(toastElement);

        let autohide = (stayOpen) ? {autohide: false} : {};
        let toast = new bootstrap.Toast(toastElement, autohide);

        // Display the Toast
        toast.show();
    }

}

export enum ToastType {
    PRIMARY = "PRIMARY",
    INFO = "INFO",
    DANGER = "DANGER",
    SUCESS = "SUCESS",
    WARNING = "WARNING",
}