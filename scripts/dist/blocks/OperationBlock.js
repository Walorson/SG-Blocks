class OperationBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.mathOperation = '2+2';
        this.roundingMode = "None";
        this.toDecimalPlaces = 0;
        this.toDecimalPlacesStatus = "disabled";
        this.variableName = settings.defaultVariablePrefix + (globalVariables.size + 1);
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
        const pow = Math.pow(10, this.toDecimalPlaces);
        switch (this.roundingMode) {
            case "Default": return Math.round(number * pow) / pow;
            case "Floor": return Math.floor(number * pow) / pow;
            case "Ceil": return Math.ceil(number * pow) / pow;
            default: return number;
        }
    }
    properties() {
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 1)
                return;
            propertiesWindow.innerHTML = `
                <p>Mathematical Operations: <textarea class="property${this.id}">${this.mathOperation}</textarea></p>
                <p>Rounding: 
                    <select class="property${this.id}" selected="${this.roundingMode}">
                        <option>None</option>
                        <option>Default</option>
                        <option>Floor</option>
                        <option>Ceil</option>
                    </select>
                </p>
                <p>to decimal places: <input type="number" value="${this.toDecimalPlaces}" class="property${this.id}" ${this.toDecimalPlacesStatus}></p>
                <p>Save to Variable: <br> = <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.mathOperation = property[0].value;
                this.updateDiv();
            };
            property[1].value = this.roundingMode;
            property[1].oninput = () => {
                this.roundingMode = property[1].value;
                if (this.roundingMode == 'None') {
                    if (this.toDecimalPlacesStatus == "") {
                        this.toDecimalPlacesStatus = "disabled";
                        property[2].setAttribute("disabled", ";");
                    }
                }
                else {
                    if (this.toDecimalPlacesStatus == "disabled") {
                        this.toDecimalPlacesStatus = "";
                        property[2].removeAttribute("disabled");
                    }
                }
            };
            property[2].oninput = () => {
                this.toDecimalPlaces = property[2].value;
            };
            property[3].oninput = () => {
                this.variableName = property[3].value;
            };
            super.properties();
        });
    }
}
