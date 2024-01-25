class OutputBlock extends Block {
    message: string;
    isVariable: boolean;
    variable: any;

    constructor(x: number = 0, y: number = 0, message: string = "Hello World!", isVariable: boolean = false) {
        super(x, y);
        this.message = message;
        this.isVariable = isVariable;

        this.init();
    }

    execute(): void {
        this.setActive();
       
        setTimeout(() => {
            if(this.isVariable) {
                console.log(this.message + globalVariables.get(this.variable));
                alert(this.message + globalVariables.get(this.variable));
            }
            else {
                console.log(this.message);
                alert(this.message);
            }

            this.executeNextBlock();
        }, runSpeed/5);
    }

    createBlock(): void {
            workspace.innerHTML += `<div class="block output" id="${this.id}"><span>Print: ${this.message}</span></div>`;
    }

    updateDiv(): void {
        let messageShort: string = this.message;

        if(this.message.length > 18)
        {
            messageShort = this.message.slice(0, 18);
            messageShort += "... ";
        }

        if(this.variable != undefined)
        {
            this.div.innerHTML = `<span>Print: ${messageShort}<b>${this.variable}</b></span>`;
        }
        else
        {
            this.div.innerHTML = "<span>Print: "+messageShort+"</span>";
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
                else
                {
                    this.isVariable = false;
                    this.variable = undefined;
                }

                this.updateDiv();
            }

            if(this.isVariable == true) property[1].value = this.variable;

            super.properties();
        });

        
    }
}
