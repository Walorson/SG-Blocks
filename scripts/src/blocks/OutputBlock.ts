class OutputBlock extends Block {
    message: string;
    isVariable: boolean;
    variable: any;
    maxConnects: number = 2;

    constructor(x: number, y: number, message: string = "Hello World!", isVariable: boolean = false) {
        super(x, y);
        this.message = message;
        this.isVariable = isVariable;

        this.init();
    }

    execute(): void {
        if(this.isVariable) {
            console.log(this.message + globalVariables.get(this.variable));
        }
        else {
            console.log(this.message);
        }
        
        this.connectToExecute();
    }

    createBlock(): void {
            workspace.innerHTML += `<div class="block output" id="${this.id}">Print: ${this.message}</div>`;
    }

    updateDiv(): void {
        if(this.variable != undefined)
        {
            this.div.innerHTML = `Print: ${this.message}<b>${this.variable}</b>`;
        }
        else
        {
            this.div.innerHTML = "Print: "+this.message;
        }
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            let select: string = `<p>Print Variable: <select class="property${this.id}"><option>---</option>`;

            globalVariables.forEach((variable: any, key: string) => {
                select += `<option>${key}</option>`;
            });

            propertiesWindow.innerHTML = `
                <p>Message: <input type="text" value="${this.message}" class="property${this.id}"></p>
            `+select;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);

            property[0].oninput = () => {
                this.message = property[0].value;
                this.updateDiv();
            };

            property[1].oninput = () => {
                if(property[1].value != "---")
                {
                    this.isVariable = true;
                    this.variable = property[1].value;
                }
                else this.isVariable = false;

                this.updateDiv();
            }

            if(this.isVariable == true) property[1].value = this.variable;
        });
    }
}