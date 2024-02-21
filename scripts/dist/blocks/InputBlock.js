class InputBlock extends Block {
    constructor(x = 0, y = 0, variableName = undefined, message = "Enter variable") {
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
            if (!isNaN(Number(variable))) {
                globalVariables.set(this.variableName, Number(variable));
                console.log("Input as number: " + variable);
            }
            else {
                globalVariables.set(this.variableName, variable);
                console.log("Input: " + variable);
            }
            this.executeNextBlock();
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
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Variable Name: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
                <p>Message: <textarea class="property${this.id}">${this.message}</textarea></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.variableName = property[0].value;
                this.updateDiv();
            };
            property[1].oninput = () => {
                this.message = property[1].value;
            };
            super.properties();
        });
    }
}
