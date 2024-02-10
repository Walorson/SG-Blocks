class OperationBlock extends Block {
    value: number[] = [0,0];
    operator: string = '+';
    isValueVariable: boolean[] = [false, false];
    variableName: string;
    valueName: string[] = [];

    constructor(x: number = 0, y: number = 0) {
        super(x, y);
        this.variableName = "a"+this.id;

        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block operation" id="${this.id}">Operation: <i>${this.value[0]}${this.operator}${this.value[1]}</i></div>`;
    }

    updateDiv(): void
    {
        if(this.isValueVariable[0] == true && this.isValueVariable[1] == true)
        {
            this.div.innerHTML = `Operation: <i><b>${this.valueName[0]}</b>${this.operator}<b>${this.valueName[1]}</b></i>`;
        }
        else if(this.isValueVariable[0] == true)
        {
            this.div.innerHTML = `Operation: <i><b>${this.valueName[0]}</b>${this.operator}${this.value[1]}</i>`;
        }
        else if(this.isValueVariable[1] == true)
        {
            this.div.innerHTML = `Operation: <i>${this.value[0]}${this.operator}<b>${this.valueName[1]}</b></i>`;
        }
        else
        {
            this.div.innerHTML = `Operation: <i>${this.value[0]}${this.operator}${this.value[1]}</i>`;
        }

        super.updateDiv();
    }

    execute(): void {
        this.setActive();

        for(let i=0; i<this.isValueVariable.length; i++)
        {
            if(this.isValueVariable[i]) this.value[i] = Number(globalVariables.get(this.valueName[i]));
        }
        
        let result: number;
        this.value[0] = Number(this.value[0]);
        this.value[1] = Number(this.value[1]);
        switch(this.operator)
        {
            case "+": result = this.value[0] + this.value[1]; break;
            case "-": result = this.value[0] - this.value[1]; break;
            case "*": result = this.value[0] * this.value[1]; break;
            case "/": result = this.value[0] / this.value[1]; break;
            case "%": result = this.value[0] % this.value[1]; break;
        }

        globalVariables.set(this.variableName, result);

        this.executeNextBlock();
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Value 1: <span class="value"><input type="text" value="${this.value[0]}" class="property${this.id}"></span></p>
                <p><label><input type="checkbox" class="property${this.id}">Variable<label></p>
                <p>Value 2: <span class="value"><input type="text" value="${this.value[1]}" class="property${this.id}"></span></p>
                <p><label><input type="checkbox" class="property${this.id}">Variable<label></p>
                <p>Operation: 
                    <select class="property${this.id}">
                        <option>+</option>
                        <option>-</option>
                        <option>*</option>
                        <option>/</option>
                        <option>%</option>
                    </select>
                </p>
                <p>Save to variable: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;

            let property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            const value: any = propertiesWindow.querySelectorAll(".value");
            
            property[0].oninput = () => {
                this.value[0] = property[0].value;
                this.updateDiv();
            }

            for(let i=0; i<this.isValueVariable.length; i++)
            {
                const id: number = 2*i+1;

                property[id].onchange = () => {
                    if(property[id].checked)
                    {
                        value[i].innerHTML = createSelectVariables("property"+i);
    
                        const property: any = document.getElementById("property"+i);
                        property.oninput = () => {
                            if(property.value != "---")
                            {
                                this.isValueVariable[i] = true;
                                this.valueName[i] = property.value;
                            }
                            else
                            {
                                this.isValueVariable[i] = false;
                            }
                            this.updateDiv();
                        }
                    }
                    else
                    {
                        this.isValueVariable[i] = false;

                        value[i].innerHTML = `<input type="text" value="${this.value[i]}" id="property${i}">`;
                        const property: any = document.getElementById("property"+i);
                        property.oninput = () => {
                            this.value[i] = property.value;
                            this.updateDiv();
                        }

                        this.updateDiv();
                    }
                }
            }

            property[2].oninput = () => {
                this.value[1] = property[2].value;
                this.updateDiv();
            };

            property[4].onchange = () => {
                this.operator = property[4].value;
                this.updateDiv();
            }
            property[4].value = this.operator;

            property[5].oninput = () => {
                this.variableName = property[5].value;
            }

            for(let i=0; i<this.isValueVariable.length; i++)
            {
                if(this.isValueVariable[i] == true) 
                {
                    property[2*i+1].checked = true; 
                    value[i].innerHTML = createSelectVariables("property"+i);

                    let propertyX: any = document.getElementById("property"+i);
                    propertyX.value = this.valueName[i];

                    propertyX.oninput = () => {
                        if(property.value != "---")
                        {
                            this.isValueVariable[i] = true;
                            this.valueName[i] = propertyX.value;
                        }
                        else
                        {
                            this.isValueVariable[i] = false;
                            this.value[i] = 0;
                        }
                        this.updateDiv();
                    }

                }
            }
            super.properties();
        });
    }
}
