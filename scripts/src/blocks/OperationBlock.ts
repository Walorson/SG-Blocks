class OperationBlock extends Block {
    mathOperation: string = '2+2';
    variableName: string;

    constructor(x: number = 0, y: number = 0) {
        super(x, y);
        this.variableName = "a"+this.id;

        globalVariables.set(this.variableName, null);
        this.init();
    }

    execute(): void {
        this.setActive();
        
        const result = eval(replaceVariablesToValues(this.mathOperation));
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

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Mathematical Operations: <textarea class="property${this.id}">${this.mathOperation}</textarea></p>
                <p>Save to Variable: <br> = <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                this.mathOperation = property[0].value;

                this.updateDiv();
            }

            property[1].oninput = () => {
                this.variableName = property[1].value; 
            };

            super.properties();
        });
        
    }
}
