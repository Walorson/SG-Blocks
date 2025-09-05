class MessageBox {
    message: string;
    title: string;
    okBtn: HTMLElement;

    constructor(message: string, title: string = "MESSAGE_BOX") {
        this.message = message;
        this.title = title;

        this.createWindow();

        this.okBtn = document.getElementById("messageBox-OK");
        this.okBtn.addEventListener("click", () => {
            this.okBtnEvent();
        });

        const enterToCloseTheWindow = (e: KeyboardEvent) => {
            if(e.key == 'Enter') {
                this.okBtn.click();
                window.removeEventListener("keypress", enterToCloseTheWindow);
            }
        }

        window.addEventListener("keypress", enterToCloseTheWindow);
    }

    createWindow(): void {
        document.body.insertAdjacentHTML("afterbegin", `
        <div class="window messageBox" id="messageBox">
            <div class="nav-top"><span class="title-window">${this.title}</span><div class="window-quit" onclick='parentElement.parentElement.remove()'>X</div></div>

            <p class="window-p">${this.message}</p>

            <div class="confirmation-buttons">
                <button id="messageBox-OK">OK</button>
            </div>
        </div>
 
        `);
    }

    okBtnEvent(): void {
        this.okBtn.parentElement.parentElement.remove();
    }
}

class InputBox extends MessageBox {
    inputValue: string;
    constructor(message: string, title: string = "INPUT_BOX") {
        super(message, title);
    }

    createWindow(): void {
         document.body.insertAdjacentHTML("afterbegin", `
         <div class="window messageBox" id="messageBox">
            <div class="nav-top"><span class="title-window">${this.title}</span><div class="window-quit" onclick='parentElement.parentElement.remove()'>X</div></div>

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

    okBtnEvent(): void {
        const input: any = document.getElementById("messageBox-input");
        this.inputValue = input.value;

        this.okBtn.parentElement.parentElement.remove();
        isInputFocus = false;
    }
}