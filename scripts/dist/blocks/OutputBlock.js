class OutputBlock extends Block {
    constructor(x, y, message = "Hello World!", isVariable = false) {
        super(x, y);
        this.maxConnects = 2;
        this.message = message;
        this.isVariable = isVariable;
        this.init();
    }
    execute() {
        if (this.isVariable) {
            console.log(this.message + globalVariables.get(this.variable));
        }
        else {
            console.log(this.message);
        }
        this.connectToExecute();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block output" id="${this.id}">${this.message}</div>`;
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            let select = `<p>Print Variable: <select class="property${this.id}"><option>---</option>`;
            globalVariables.forEach((variable, key) => {
                select += `<option>${key}</option>`;
            });
            propertiesWindow.innerHTML = `
                <p>Message: <input type="text" value="${this.message}" class="property${this.id}"></p>
            ` + select;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.message = property[0].value;
                this.div.textContent = this.message;
            };
            property[1].oninput = () => {
                console.log(property[1].value);
                if (property[1].value != "---") {
                    this.isVariable = true;
                    this.variable = property[1].value;
                }
                else
                    this.isVariable = false;
            };
            if (this.isVariable == true)
                property[1].value = this.variable;
        });
    }
}