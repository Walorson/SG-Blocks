class InputBlock extends Block {
    constructor(x, y, variableName, message = "Enter variable") {
        super(x, y);
        this.message = message;
        this.variableName = variableName;
        globalVariables.set(this.variableName, null);
        this.init();
    }
    execute() {
        this.setActive();
        setTimeout(() => {
            const variable = prompt(this.message);
            globalVariables.set(this.variableName, variable);
            console.log("Input: " + variable);
            this.connectToExecute();
        }, runSpeed / 5);
    }
    createBlock() {
        workspace.innerHTML += `<div class="block input" id="${this.id}">Input: <b>${this.variableName}</b></div>`;
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Variable Name: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
                <p>Message: <input type="text" value="${this.message}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.variableName = property[0].value;
                this.div.innerHTML = `Input: <b>${this.variableName}</b>`;
            };
            property[1].oninput = () => {
                this.message = property[1].value;
            };
        });
    }
}
