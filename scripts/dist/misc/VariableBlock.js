class VariableBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.maxConnects = 0;
        this.variableName = defaultVariablePrefix + (globalVariables.size + 1);
        this.variableValue = 0;
        globalVariables.set(this.variableName, this.variableValue);
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block variable" id="${this.id}"></div>`;
    }
    updateDiv() {
        this.div.innerHTML = `<b>${this.variableName}</b> = ${this.variableValue}`;
        super.updateDiv();
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Name: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
                <p>Initial Value: <input type="text" value="${this.variableValue}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.variableName = property[0].value;
                this.updateDiv();
            };
            property[1].oninput = () => {
                this.variableValue = property[1].value;
                this.updateDiv();
            };
            super.properties();
        });
    }
}
