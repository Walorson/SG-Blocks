class ConditionBlock extends Block {
    value1: any;
    value2: any;
    operator: string;
    maxConnects: number = 3;
    isValue1Variable: boolean;
    isValue2Variable: boolean;
    value1Name: string;
    value2Name: string;
    constructor(x: number, y: number, value1: any = 0, value2: any = 0, operator: string = "==", isValue1Variable: boolean = false, isValue2Variable: boolean = false) {
        super(x, y);
        this.value1 = value1;
        this.value2 = value2;
        this.operator = operator;
        this.isValue1Variable = isValue1Variable;
        this.isValue2Variable = isValue2Variable;

        if(this.isValue1Variable) this.value1Name = this.value1;
        if(this.isValue2Variable) this.value2Name = this.value2;

        this.init()
    }

    connectToExecute(): void {
        setTimeout(() => 
        {
            executeHistory.push(this);

            if(this.isValue1Variable == true) this.value1 = globalVariables.get(this.value1Name);
            if(this.isValue2Variable == true) this.value2 = globalVariables.get(this.value2Name);

            if(this.connectTo[0] == undefined || this.connectTo[1] == undefined) return;
            
            let result: boolean = false;

            switch(this.operator)
            {
                case "==":
                    if(this.value1 == this.value2) result = true;
                break;

                case "!=":
                    if(this.value1 != this.value2) result = true;
                break;

                case ">":
                    if(this.value1 > this.value2) result = true;
                break;

                case ">":
                    if(this.value1 < this.value2) result = true;
                break;

                case "<=":
                    if(this.value1 <= this.value2) result = true;
                break;

                case ">=":
                    if(this.value1 >= this.value2) result = true;
                break;
            }

            if(result == true) this.connectTo[1].execute();
            else if(this.connectTo[2] != undefined) this.connectTo[2].execute();

        }, RUN_SPEED);
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block condition" id="${this.id}">IF</div>`;
    }

    properties(): void {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Value 1: <span class="value"><input type="text" value="${this.value1}" class="property${this.id}"></span></p>
                <p><label><input type="checkbox" class="property${this.id}">Variable<label></p>
                <p>Value 2: <span class="value"><input type="text" value="${this.value2}" class="property${this.id}"></span></p>
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
                this.value1 = property[0].value;
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
                            this.value1 = null;
                        }
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
                this.value2 = property[2].value;
            }

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
                            this.value2 = null;
                        }
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

            property[4].oninput = () => {
                this.operator = property[4].value;
            }

            if(this.isValue1Variable == true) 
            {
                property[1].checked = true; 
                value[0].innerHTML = createSelectVariables("property0");

                let property0: any = document.getElementById("property0");
                property0.value = this.value1Name;

            }
            if(this.isValue2Variable == true) 
            {
                property[3].checked = true; 
                value[1].innerHTML = createSelectVariables("property1");

                let property1: any = document.getElementById("property1");
                property1.value = this.value1Name;
            };

        });
    }
    
}