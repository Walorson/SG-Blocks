class OperationBlock extends Block {
    mathOperation: string = '2+2';
    roundingMode: string = "None";
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
        switch(this.roundingMode) {
            case "Round": return Math.round(number);
            case "Floor": return Math.floor(number);
            case "Ceil": return Math.ceil(number);
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
                        <option>Round</option>
                        <option>Floor</option>
                        <option>Ceil</option>
                    </select>
                </p>
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
                this.variableName = property[2].value; 
            };

            super.properties();
        });
        
    }
}
