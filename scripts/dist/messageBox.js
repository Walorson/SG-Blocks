class MessageBox {
    constructor(message, title = "MESSAGE_BOX") {
        this.message = message;
        this.title = title;
        this.createWindow();
        this.initWindowEvents();
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
    initWindowEvents() {
        this.quitBtn = document.getElementById("messageBox-quit");
        this.okBtn = document.getElementById("messageBox-OK");
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
class BooleanBox extends MessageBox {
    constructor(message, title = "INPUT_BOX") {
        super(message, title);
    }
    createWindow() {
        document.body.insertAdjacentHTML("afterbegin", `
         <div class="window messageBox" id="messageBox">
            <div class="nav-top"><span class="title-window">${this.title}</span><div class="window-quit" id="messageBox-quit">X</div></div>

            <p class="window-p">${this.message}</p>

            <div class="confirmation-buttons">
                <button id="messageBox-yes">Yes</button>
                <button id="messageBox-no">No</button>
            </div>
        </div>
 
        `);
        isInputFocus = true;
    }
    yesBtnEvent() {
        this.inputValue = "yes";
        this.yesBtn.parentElement.parentElement.remove();
        isInputFocus = false;
    }
    noBtnEvent() {
        this.inputValue = "no";
        this.noBtn.parentElement.parentElement.remove();
        isInputFocus = false;
    }
    initWindowEvents() {
        this.quitBtn = document.getElementById("messageBox-quit");
        this.quitBtn.addEventListener("click", () => {
            this.quitBtnEvent();
            window.removeEventListener("keypress", enterToCloseTheWindow);
        });
        this.yesBtn = document.getElementById("messageBox-yes");
        this.yesBtn.addEventListener("click", () => this.yesBtnEvent());
        this.noBtn = document.getElementById("messageBox-no");
        this.noBtn.addEventListener("click", () => this.noBtnEvent());
        const enterToCloseTheWindow = (e) => {
            if (e.key == 'Enter') {
                this.okBtn.click();
            }
        };
        window.addEventListener("keypress", enterToCloseTheWindow);
    }
}
