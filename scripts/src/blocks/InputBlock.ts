class InputBlock extends Block {
    message: string;
    variableName: string;
    maxConnects: number = 2;

    constructor(x: number, y: number, variableName: any, message: string = "Enter variable") {
        super(x, y);
        this.message = message;
        this.variableName = variableName;

        globalVariables.set(this.variableName, null);
        this.init();
    }

    execute(): void {
        const variable: any = prompt(this.message);
        globalVariables.set(this.variableName, variable);

        this.connectToExecute();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block input" id="${this.id}">Input: <b>${this.variableName}</b></div>`;
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
                this.div.innerHTML = `Input: <b>${this.variableName}</b>`;

            }

            property[1].oninput = () => {
                this.message = property[1].value;
                this.div.textContent = this.message;
            };

        });
    }
}