class InputBlock extends Block {
    constructor(x = 0, y = 0, variableName = undefined, message = "Enter variable", mode = "textarea") {
        super(x, y);
        this.message = message;
        this.variableName = variableName;
        this.mode = mode;
        if (globalVariables.has(this.variableName) == false) {
            globalVariables.set(this.variableName, null);
        }
        this.init();
    }
    execute() {
        this.setActive();
        setTimeout(() => {
            const message = replaceVariablesToValues(this.message);
            if (this.mode == "textarea") {
                const msg = new InputBox(message);
                msg.okBtn.addEventListener("click", () => {
                    if (!isNaN(Number(msg.inputValue))) {
                        globalVariables.set(this.variableName, Number(msg.inputValue));
                        console.log("Input as number: " + msg.inputValue);
                    }
                    else {
                        globalVariables.set(this.variableName, msg.inputValue);
                        console.log("Input: " + msg.inputValue);
                    }
                    this.executeNextBlock();
                });
            }
            else if (this.mode == "boolean") {
                const msg = new BooleanBox(message);
                msg.yesBtn.addEventListener("click", () => {
                    globalVariables.set(this.variableName, "yes");
                    console.log("Input as boolean: yes");
                    this.executeNextBlock();
                });
                msg.noBtn.addEventListener("click", () => {
                    globalVariables.set(this.variableName, "no");
                    console.log("Input as boolean: no");
                    this.executeNextBlock();
                });
            }
        }, runSpeed / 5);
    }
    createBlock() {
        workspace.innerHTML += `
        <div class="block input" id="${this.id}">
            <span>Input: <b>${this.variableName}</b></span>
        </div>`;
    }
    updateDiv() {
        this.div.innerHTML = `<span>Input: <b>${this.variableName}</b></span>`;
        super.updateDiv();
    }
    properties() {
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 1)
                return;
            propertiesWindow.innerHTML = `             
                <p>Message: <textarea class="property${this.id}">${this.message}</textarea></p>
                <p>Input Mode: <select class="property${this.id}">
                    <option>textarea</option>
                    <option>boolean</option>
                </select></p>
                <p>Save to Variable: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].value = this.mode;
            property[0].oninput = () => {
                this.mode = property[2].value;
            };
            property[1].oninput = () => {
                this.message = property[1].value;
            };
            property[2].oninput = () => {
                this.variableName = property[0].value;
                this.updateDiv();
            };
            super.properties();
        });
    }
}
