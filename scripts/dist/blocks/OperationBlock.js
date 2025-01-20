class OperationBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.mathOperation = '2+2';
        this.roundingMode = "None";
        this.variableName = "a" + this.id;
        globalVariables.set(this.variableName, null);
        this.init();
    }
    execute() {
        this.setActive();
        const result = this.round(eval(replaceVariablesToValues(sanitizeOperation(this.mathOperation))));
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
    round(number) {
        switch (this.roundingMode) {
            case "Round": return Math.round(number);
            case "Floor": return Math.floor(number);
            case "Ceil": return Math.ceil(number);
            default: return number;
        }
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Mathematical Operations: <textarea class="property${this.id}">${this.mathOperation}</textarea></p>
                <p>Rounding: 
                    <select class="property${this.id}">
                        <option>None</option>
                        <option>Round</option>
                        <option>Floor</option>
                        <option>Ceil</option>
                    </select>
                </p>
                <p>Save to Variable: <br> = <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.mathOperation = property[0].value;
                this.updateDiv();
            };
            property[1].oninput = () => {
                this.roundingMode = property[1].value;
            };
            property[2].oninput = () => {
                this.variableName = property[2].value;
            };
            super.properties();
        });
    }
}
