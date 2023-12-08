class ConditionBlock extends Block {
    value: any[] = [0,0]
    operator: string = "==";
    maxConnects: number = 3;
    isValueVariable: boolean[] = [false, false];
    valueName: string[] = [];
    constructor(x: number, y: number) {
        super(x, y);

        for(let i=0; i<this.isValueVariable.length; i++)
        {
            if(this.isValueVariable[i] == true) this.valueName[i] = this.value[i];
        }

        this.init()
    }

    connectToExecute(): void {
        setTimeout(() => 
        {
            executeHistory.push(this);

            for(let i=0; i<this.isValueVariable.length; i++)
            {
                if(this.isValueVariable[i] == true) this.value[i] = globalVariables.get(this.valueName[i]);
            }

            if(this.connectTo[0] == undefined || this.connectTo[1] == undefined) return;
            
            let result: boolean = false;

            switch(this.operator)
            {
                case "==":
                    if(this.value[0] == this.value[1]) result = true;
                break;

                case "!=":
                    if(this.value[0] != this.value[1]) result = true;
                break;

                case ">":
                    if(this.value[0] > this.value[1]) result = true;
                break;

                case ">":
                    if(this.value[0]< this.value[1]) result = true;
                break;

                case "<=":
                    if(this.value[0] <= this.value[1]) result = true;
                break;

                case ">=":
                    if(this.value[0] >= this.value[1]) result = true;
                break;
            }

            if(result == true) this.connectTo[1].execute();
            else if(this.connectTo[2] != undefined) this.connectTo[2].execute();

        }, 1);
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block condition" id="${this.id}">IF</div>`;
    }

    properties(): void {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Value 1: <span class="value"><input type="text" value="${this.value[0]}" class="property${this.id}"></span></p>
                <p><label><input type="checkbox" class="property${this.id}">Variable<label></p>
                <p>Value 2: <span class="value"><input type="text" value="${this.value[1]}" class="property${this.id}"></span></p>
                <p><label><input type="checkbox" class="property${this.id}">Variable<label></p>
                <p>Operator: <select class="property${this.id}">
                                <option>==</option>
                                <option>!=</option>
                                <option>></option>
                                <option><</option>
                                <option>>=</option>
                                <option><=</option>
                            </select></p>
            `;

            let property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            const value: any = propertiesWindow.querySelectorAll(".value");

            property[0].oninput = () => {
                this.value[0] = property[0].value;
            }
            for(let i=0; i<this.isValueVariable.length; i++)
            {
                let id = 2*i+1;

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
                                this.value[i] = null;
                            }
                        }
                    }
                    else
                    {
                        value[i].innerHTML = `<input type="text" value="${this.value[i]}" id="property${i}">`;
                        const property: any = document.getElementById("property"+i);
                        property.oninput = () => {
                            this.value[i] = property.value;
                        }
                    }
                }
            }
            property[2].oninput = () => {
                this.value[1] = property[2].value;
            }

            property[4].oninput = () => {
                this.operator = property[4].value;
            }
            property[4].value = this.operator;

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
                            this.value[i] = null;
                        }
                    }

                }
            }
        });
    }
    
}