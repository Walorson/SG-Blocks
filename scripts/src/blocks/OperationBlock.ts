class OperationBlock extends Block {
    value1: number;
    value2: number;
    operator: string;
    isValue1Variable: boolean;
    isValue2Variable: boolean;
    variableName: string;
    value1Name: string;
    value2Name: string;
    maxConnects: number = 2;

    constructor(x: number, y: number, value1: number = 0, value2: number = 0, operator: string = "+") {
        super(x, y);
        this.value1 = value1;
        this.value2 = value2;
        this.operator = operator;
        this.variableName = "a"+this.id;

        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block input" id="${this.id}">Operation: <i>${this.value1}${this.operator}${this.value2}</i></div>`;
    }

    updateDiv(): void
    {
        if(this.isValue1Variable == true && this.isValue2Variable == true)
        {
            this.div.innerHTML = `Operation: <i><b>${this.value1Name}</b>${this.operator}<b>${this.value2Name}</b></i>`;
        }
        else if(this.isValue1Variable == true)
        {
            this.div.innerHTML = `Operation: <i><b>${this.value1Name}</b>${this.operator}${this.value2}</i>`;
        }
        else if(this.isValue2Variable == true)
        {
            this.div.innerHTML = `Operation: <i>${this.value1}${this.operator}<b>${this.value2Name}</b></i>`;
        }
        else
        {
            this.div.innerHTML = `Operation: <i>${this.value1}${this.operator}${this.value2}</i>`;
        }
    }

    execute(): void {
        if(this.isValue1Variable) this.value1 = Number(globalVariables.get(this.value1Name));
        if(this.isValue2Variable) this.value2 = Number(globalVariables.get(this.value2Name));

        let result: number;
        switch(this.operator)
        {
            case "+": result = this.value1 + this.value2; break;
            case "-": result = this.value1 - this.value2; break;
            case "*": result = this.value1 * this.value2; break;
            case "/": result = this.value1 / this.value2; break;
        }

        globalVariables.set(this.variableName, result);

        this.connectToExecute();
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Value 1: <span class="value"><input type="text" value="${this.value1}" class="property${this.id}"></span></p>
                <p><label><input type="checkbox" class="property${this.id}">Variable<label></p>
                <p>Value 2: <span class="value"><input type="text" value="${this.value2}" class="property${this.id}"></span></p>
                <p><label><input type="checkbox" class="property${this.id}">Variable<label></p>
                <p>Operation: 
                    <select class="property${this.id}">
                        <option>+</option>
                        <option>-</option>
                        <option>*</option>
                        <option>/</option>
                    </select>
                </p>
                <p>Save to variable: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;

            let property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            const value: any = propertiesWindow.querySelectorAll(".value");
            
            property[0].oninput = () => {
                this.value1 = Number(property[0].value);
                this.updateDiv();
            }

            property[1].onchange = () => {
                if(property[1].checked)
                {
                    value[0].innerHTML = createSelectVariables("property0");

                    const property: any = document.getElementById("property0");
                    property.oninput = () => {
                        if(property.value != "---")
                        {
                            this.isValue1Variable = true;
                            this.value1Name = property.value;
                        }
                        else
                        {
                            this.isValue1Variable = false;
                            this.value1 = 0;
                        }
                        this.updateDiv();
                    }
                }
                else
                {
                    value[0].innerHTML = `<input type="text" value="${this.value1}" id="property0">`;
                    const property: any = document.getElementById("property0");
                    property.oninput = () => {
                        this.value1 = property.value;
                    }
                }
            }

            property[2].oninput = () => {
                this.value2 = Number(property[2].value);
                this.updateDiv();
            };

            property[3].onchange = () => {
                if(property[3].checked)
                {
                    value[1].innerHTML = createSelectVariables("property1");

                    const property: any = document.getElementById("property1");
                    property.oninput = () => {
                        if(property.value != "---")
                        {
                            this.isValue2Variable = true;
                            this.value2Name = property.value;
                        }
                        else
                        {
                            this.isValue2Variable = false;
                            this.value2 = 0;
                        }
                        this.updateDiv();
                    }
                }
                else
                {
                    value[1].innerHTML = `<input type="text" value="${this.value2}" id="property1">`;
                    const property: any = document.getElementById("property1");
                    property.oninput = () => {
                        this.value2 = property.value;
                    }
                }
            }

            property[4].onchange = () => {
                this.operator = property[4].value;
                this.updateDiv();
            }
            property[4].value = this.operator;

            property[5].oninput = () => {
                this.variableName = property[5].value;
            }

            if(this.isValue1Variable == true) 
            {
                property[1].checked = true; 
                value[0].innerHTML = createSelectVariables("property0");

                let property0: any = document.getElementById("property0");
                property0.value = this.value1Name;

                property0.oninput = () => {
                    if(property.value != "---")
                    {
                        this.isValue1Variable = true;
                        this.value1Name = property0.value;
                    }
                    else
                    {
                        this.isValue1Variable = false;
                        this.value1 = 0;
                    }
                    this.updateDiv();
                }

            }
            if(this.isValue2Variable == true) 
            {
                property[3].checked = true; 
                value[1].innerHTML = createSelectVariables("property1");

                let property1: any = document.getElementById("property1");
                property1.value = this.value1Name;

                property1.oninput = () => {
                    if(property.value != "---")
                    {
                        this.isValue1Variable = true;
                        this.value1Name = property1.value;
                    }
                    else
                    {
                        this.isValue1Variable = false;
                        this.value1 = 0;
                    }
                    this.updateDiv();
                }
            };
        });
    }
}