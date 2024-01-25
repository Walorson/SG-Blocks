class InputBlock extends Block {
    message: string;
    variableName: string;

    constructor(x: number = 0, y: number = 0, variableName: any = undefined, message: string = "Enter variable") {
        super(x, y);
        this.message = message;
        this.variableName = variableName;

        globalVariables.set(this.variableName, null);
        this.init();
    }

    execute(): void {
        this.setActive();
        
        setTimeout(() => {
            const variable: any = prompt(this.message);
            if(!isNaN(Number(variable))) {
              globalVariables.set(this.variableName, Number(variable));
              console.log("Input as number: "+variable);
            } 
            else {
                globalVariables.set(this.variableName, variable);
                console.log("Input: "+variable);
            }

            this.executeNextBlock();
        }, runSpeed/5);
    }

    createBlock(): void {
        workspace.innerHTML += `
        <div class="block input" id="${this.id}">
            <span>Input: <b>${this.variableName}</b></span>
        </div>`;
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Variable Name: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
                <p>Message: <input type="text" value="${this.message}" class="property${this.id}"></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                this.variableName = property[0].value;
                this.div.innerHTML = `<span>Input: <b>${this.variableName}</b></span>`;

            }

            property[1].oninput = () => {
                this.message = property[1].value;
            };

            super.properties();
        });
        
    }
}
