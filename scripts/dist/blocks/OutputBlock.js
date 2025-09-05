class OutputBlock extends Block {
    constructor(x = 0, y = 0, message = "Hello World!", isVariable = false) {
        super(x, y);
        this.message = message;
        this.isVariable = isVariable;
        this.init();
    }
    execute() {
        this.setActive();
        setTimeout(() => {
            const message = replaceVariablesToValues(this.message);
            if (this.isVariable) {
                console.log(message + globalVariables.get(this.variable));
                const msg = new MessageBox(message + globalVariables.get(this.variable));
                msg.okBtn.addEventListener("click", () => this.executeNextBlock());
            }
            else {
                console.log(message);
                const msg = new MessageBox(message);
                msg.okBtn.addEventListener("click", () => this.executeNextBlock());
            }
        }, runSpeed / 5);
    }
    createBlock() {
        workspace.innerHTML += `<div class="block output" id="${this.id}"><span>Print: ${this.message}</span></div>`;
    }
    updateDiv() {
        let messageShort = this.message;
        if (this.message.length > settings.outputMessageLength && settings.shortOutputMessage == true) {
            messageShort = this.message.slice(0, settings.outputMessageLength);
            messageShort += "... ";
        }
        messageShort = boldVariables(messageShort);
        if (this.variable != undefined) {
            this.div.innerHTML = `<span>Print: ${messageShort}<b>${this.variable}</b></span>`;
        }
        else {
            this.div.innerHTML = `<span>Print: ${messageShort}</span>`;
        }
        super.updateDiv();
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Message: <textarea class="property${this.id}">${this.message}</textarea></p>
            Print Variable on End: ` + createSelectVariables("property" + this.id, undefined, true);
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.message = property[0].value;
                this.updateDiv();
            };
            property[1].oninput = () => {
                if (property[1].value != "---") {
                    this.isVariable = true;
                    this.variable = property[1].value;
                }
                else {
                    this.isVariable = false;
                    this.variable = undefined;
                }
                this.updateDiv();
            };
            if (this.isVariable == true)
                property[1].value = this.variable;
            super.properties();
        });
    }
}
