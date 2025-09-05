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
            const message: string = replaceVariablesToValues(this.message);

            const msg: InputBox = new InputBox(message);

            msg.okBtn.addEventListener("click", () => {
                if(!isNaN(Number(msg.inputValue))) {
                    globalVariables.set(this.variableName, Number(msg.inputValue));
                    console.log("Input as number: "+msg.inputValue);
                }
                else {
                    globalVariables.set(this.variableName, msg.inputValue);
                    console.log("Input: "+msg.inputValue);
                }
                this.executeNextBlock();
            });
            
        }, runSpeed/5);
    }

    createBlock(): void {
        workspace.innerHTML += `
        <div class="block input" id="${this.id}">
            <span>Input: <b>${this.variableName}</b></span>
        </div>`;
    }

    updateDiv(): void {
        this.div.innerHTML = `<span>Input: <b>${this.variableName}</b></span>`;

        super.updateDiv();
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Variable Name: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
                <p>Message: <textarea class="property${this.id}">${this.message}</textarea></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                this.variableName = property[0].value;
                this.updateDiv();
            }

            property[1].oninput = () => {
                this.message = property[1].value;
            };

            super.properties();
        });
        
    }
}
