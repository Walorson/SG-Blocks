class OperationBlock extends Block {
    mathOperation: string = '2+2';
    roundingMode: string = "None";
    toDecimalPlaces: number = 0;
    variableName: string;

    constructor(x: number = 0, y: number = 0) {
        super(x, y);
        this.variableName = "a"+this.id;

        globalVariables.set(this.variableName, null);
        this.init();
    }

    execute(): void {
        this.setActive();
        
        const result = this.round(eval(replaceVariablesToValues(sanitizeOperation(this.mathOperation))));
        globalVariables.set(this.variableName, result);

        this.executeNextBlock();
    }

    createBlock(): void {
        workspace.innerHTML += `
        <div class="block operation" id="${this.id}"></div>`;
    }

    updateDiv(): void {
        this.div.innerHTML = `<span><b>Operation: </b>${boldVariables(this.mathOperation)}</span>`;

        super.updateDiv();
    }

    round(number: number): number
    {
        const pow: number = Math.pow(10, this.toDecimalPlaces);
        switch(this.roundingMode) {
            case "Normal": return Math.round(number * pow) / pow;
            case "Floor": return Math.floor(number * pow) / pow;
            case "Ceil": return Math.ceil(number * pow) / pow;
            default: return number;
        }
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Mathematical Operations: <textarea class="property${this.id}">${this.mathOperation}</textarea></p>
                <p>Rounding: 
                    <select class="property${this.id}">
                        <option>None</option>
                        <option>Normal</option>
                        <option>Floor</option>
                        <option>Ceil</option>
                    </select>
                </p>
                <p>to decimal places: <input type="number" value="${this.toDecimalPlaces}" class="property${this.id}"></p>
                <p>Save to Variable: <br> = <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                this.mathOperation = property[0].value;

                this.updateDiv();
            }

            property[1].oninput = () => {
                this.roundingMode = property[1].value;
            }

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
