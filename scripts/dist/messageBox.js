class messageBox {
    constructor(message, title = "MESSAGE_BOX") {
        this.message = message;
        this.title = title;
        document.body.insertAdjacentHTML("afterbegin", `
        <div class="window messageBox" id="messageBox">
            <div class="nav-top"><span class="title-window">${this.title}</span><div class="window-quit" onclick='parentElement.parentElement.remove()'>X</div></div>

            <p class="window-p">${this.message}</p>

            <div class="confirmation-buttons">
                <button id="messageBox-OK">OK</button>
            </div>
        </div>
 
        `);
        this.okBtn = document.getElementById("messageBox-OK");
        this.okBtn.addEventListener("click", () => {
            this.okBtn.parentElement.parentElement.remove();
        });
    }
}
