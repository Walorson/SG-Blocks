class VariableBlock extends Block {
    message: string;
    variableName: string;
    variableValue: any;
    maxConnects: number = 0;

    constructor(x: number = 0, y: number = 0) {
        super(x, y);
        this.variableName = settings.defaultVariablePrefix + (globalVariables.size+1);
        this.variableValue = 0;

        globalVariables.set(this.variableName, this.variableValue);
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block variable" id="${this.id}"></div>`;
    }

    updateDiv(): void {
        this.div.innerHTML = `<b>${this.variableName}</b> = ${this.variableValue}`;

        super.updateDiv();
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Name: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
                <p>Initial Value: <input type="text" value="${this.variableValue}" class="property${this.id}"></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                this.variableName = property[0].value;
                this.updateDiv();
            }

            property[1].oninput = () => {
                this.variableValue = property[1].value;
                this.updateDiv();
            };

            super.properties();
        });
        
    }
}
