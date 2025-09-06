class MessageBox {
    constructor(message, title = "MESSAGE_BOX") {
        this.message = message;
        this.title = title;
        this.createWindow();
        this.okBtn = document.getElementById("messageBox-OK");
        this.quitBtn = document.getElementById("messageBox-quit");
        this.okBtn.addEventListener("click", () => {
            this.okBtnEvent();
            window.removeEventListener("keypress", enterToCloseTheWindow);
        });
        this.quitBtn.addEventListener("click", () => {
            this.quitBtnEvent();
            window.removeEventListener("keypress", enterToCloseTheWindow);
        });
        const enterToCloseTheWindow = (e) => {
            if (e.key == 'Enter') {
                this.okBtn.click();
            }
        };
        window.addEventListener("keypress", enterToCloseTheWindow);
    }
    createWindow() {
        document.body.insertAdjacentHTML("afterbegin", `
        <div class="window messageBox" id="messageBox">
            <div class="nav-top"><span class="title-window">${this.title}</span><div class="window-quit" id="messageBox-quit">X</div></div>

            <p class="window-p">${this.message}</p>

            <div class="confirmation-buttons">
                <button id="messageBox-OK">OK</button>
            </div>
        </div>
 
        `);
    }
    okBtnEvent() {
        this.okBtn.parentElement.parentElement.remove();
    }
    quitBtnEvent() {
        this.quitBtn.parentElement.parentElement.remove();
        endRun();
    }
}
class InputBox extends MessageBox {
    constructor(message, title = "INPUT_BOX") {
        super(message, title);
    }
    createWindow() {
        document.body.insertAdjacentHTML("afterbegin", `
         <div class="window messageBox" id="messageBox">
            <div class="nav-top"><span class="title-window">${this.title}</span><div class="window-quit" id="messageBox-quit">X</div></div>

            <p class="window-p">${this.message}</p>
            <p class="window-p"><input type="text" id="messageBox-input" placeholder="Type..."></p>

            <div class="confirmation-buttons">
                <button id="messageBox-OK">Save</button>
            </div>
        </div>
 
        `);
        document.getElementById("messageBox-input").focus();
        isInputFocus = true;
    }
    okBtnEvent() {
        const input = document.getElementById("messageBox-input");
        this.inputValue = input.value;
        this.okBtn.parentElement.parentElement.remove();
        isInputFocus = false;
    }
}
