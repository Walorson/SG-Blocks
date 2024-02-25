class OperationBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.mathOperation = '2+2';
        this.variableName = "a" + this.id;
        globalVariables.set(this.variableName, null);
        this.init();
    }
    execute() {
        this.setActive();
        const result = eval(replaceVariablesToValues(this.mathOperation));
        globalVariables.set(this.variableName, result);
        this.executeNextBlock();
    }
    createBlock() {
        workspace.innerHTML += `
        <div class="block operation" id="${this.id}"></div>`;
    }
    updateDiv() {
        this.div.innerHTML = `<span><b>Operation: </b>${boldVariables(this.mathOperation)}</span>`;
        super.updateDiv();
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Mathematical Operations: <textarea class="property${this.id}">${this.mathOperation}</textarea></p>
                <p>Save to Variable: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.mathOperation = property[0].value;
                this.updateDiv();
            };
            property[1].oninput = () => {
                this.variableName = property[1].value;
            };
            super.properties();
        });
    }
}
