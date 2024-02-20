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
            const message = this.replaceVariablesToValues(this.message);
            if (this.isVariable) {
                console.log(message + globalVariables.get(this.variable));
                alert(message + globalVariables.get(this.variable));
            }
            else {
                console.log(message);
                alert(message);
            }
            this.executeNextBlock();
        }, runSpeed / 5);
    }
    createBlock() {
        workspace.innerHTML += `<div class="block output" id="${this.id}"><span>Print: ${this.message}</span></div>`;
    }
    updateDiv() {
        let messageShort = this.message;
        if (this.message.length > 18) {
            messageShort = this.message.slice(0, 18);
            messageShort += "... ";
        }
        if (this.variable != undefined) {
            this.div.innerHTML = `<span>Print: ${messageShort}<b>${this.variable}</b></span>`;
        }
        else {
            this.div.innerHTML = "<span>Print: " + messageShort + "</span>";
        }
        super.updateDiv();
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Message: <input type="text" value="${this.message}" class="property${this.id}"></p>
            Print Variable: ` + createSelectVariables("property" + this.id, undefined, true);
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
    replaceVariablesToValues(message) {
        let readVariableMode = false;
        const variables = [];
        const variablesPosition = [];
        let variable = "";
        for (let i = 0; i < message.length; i++) {
            if (message[i] == "}") {
                readVariableMode = false;
                variables.push(variable);
                variable = "";
            }
            if (readVariableMode == true) {
                variable += message[i];
            }
            if (message[i] == "{") {
                readVariableMode = true;
                variablesPosition.push(i);
            }
        }
        if (variables.length <= 0)
            return message;
        let newMessage = "";
        let startPos = 0;
        for (let i = 0; i < variables.length; i++) {
            newMessage += message.slice(startPos, variablesPosition[i]);
            newMessage += globalVariables.get(variables[i]);
            startPos = variablesPosition[i] + variables[i].length + 2;
        }
        newMessage += message.slice(startPos, message.length);
        return newMessage;
    }
}
