class ConditionBlock extends Block {
    value: any[] = [0,0]
    operator: string = "==";
    isValueVariable: boolean[] = [false, false];
    valueName: string[] = [];
    conditions: Condition[] = [new Condition(1)];
    connectToTRUE: Block | any;
    connectToFALSE: Block | any;

    constructor(x: number = 0, y: number = 0) {
        super(x, y);

        for(let i=0; i<this.isValueVariable.length; i++)
        {
            if(this.isValueVariable[i] == true) this.valueName[i] = this.value[i];
        }

        this.init()
    }

    connectToExecute(): void {
        window.removeEventListener("keypress", this.executeOnSpacePress);
        setTimeout(() => 
        {
            executeHistory.push(this);
            this.unsetActive();

            for(let i=0; i<this.isValueVariable.length; i++)
            {
                if(this.isValueVariable[i] == true) this.value[i] = globalVariables.get(this.valueName[i]);
            }
            
            let result: boolean = false;

            if(isNaN(Number(this.value[0])) == false)
                this.value[0] = Number(this.value[0]);
            
            if(isNaN(Number(this.value[1])) == false)
                this.value[1] = Number(this.value[1]);

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

                case "<":
                    if(this.value[0] < this.value[1]) result = true;
                break;

                case "<=":
                    if(this.value[0] <= this.value[1]) result = true;
                break;

                case ">=":
                    if(this.value[0] >= this.value[1]) result = true;
                break;
            }

            if(result == true && this.connectToTRUE != undefined) this.connectToTRUE.execute();
            else if(result == false && this.connectToFALSE != undefined) this.connectToFALSE.execute();
            else if(this.connectToTRUE == undefined && this.connectToFALSE == undefined)
            {
                for(let i=0; i<this.connectTo.length; i++)
                {
                    this.connectTo[i].execute();
                }
            }
            else endRun();

        }, runSpeed);
    }

    createBlock(): void {
        workspace.innerHTML += 
        `<div class="block condition" id="${this.id}" title="Z - Linia prawda\nX - Linia Fałsz">
            0==0
        </div>`;
    }

    updateDiv(): void {
        if(this.isValueVariable[0] == true && this.isValueVariable[1] == true)
        {
            this.div.innerHTML = `<span><b>${this.valueName[0]}</b>${this.operator}<b>${this.valueName[1]}</b></span>`;;
        }
        else if(this.isValueVariable[0] == true)
        {
            this.div.innerHTML = `<span><b>${this.valueName[0]}</b>${this.operator}${this.value[1]}</span>`;;
        }
        else if(this.isValueVariable[1] == true)
        {
            this.div.innerHTML = `<span>${this.value[0]}${this.operator}<b>${this.valueName[1]}</b></span>`;;
        }
        else
        {
            this.div.innerHTML = `<span>${this.value[0]}${this.operator}${this.value[1]}</span>`;;
        }

        this.resize();
        super.updateDiv();
    }

    resize(): void {
        this.div.style.width = (this.div.textContent.length*14)+"px";
    }

    properties(): void {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <div id="conditions"></div>

                <p><button id="add-condition-button">Add condition</button></p>
            `;

            this.conditions.forEach((condition: Condition) => {
                condition.add();
            });

            let property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            const value: any = propertiesWindow.querySelectorAll(".value");
            const addCondition: HTMLElement = document.getElementById("add-condition-button");
            const conditionsContainer: HTMLElement = document.getElementById("conditions");

            property[0].oninput = () => {
                this.value[0] = property[0].value;
                this.updateDiv();
            }
            for(let i=0; i<this.isValueVariable.length; i++)
            {
                let id = 3+i;

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
                    }

                    this.updateDiv();
                }
            }
            property[2].oninput = () => {
                this.value[1] = property[2].value;
                this.updateDiv();
            }

            property[1].oninput = () => {
                this.operator = property[1].value;
                this.updateDiv();
            }
            property[1].value = this.operator;

            for(let i=0; i<this.isValueVariable.length; i++)
            {
                if(this.isValueVariable[i] == true) 
                {
                    property[i+3].checked = true; 
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

            addCondition.onclick = () => {
                conditionsContainer.innerHTML += `
                    <select>
                        <option>AND</option>
                        <option>OR</option>
                    </select>
                `;

                this.conditions.push(new Condition(this.conditions.length));
                this.conditions[this.conditions.length-1].add();
            }

            super.properties();
        });
    }

    updateConnectPoint(force: boolean = false): void {
        if(this.connectTo.length <= 0 && this.connectToTRUE == undefined && this.connectToFALSE == undefined) return;

        const lines: any = this.getLines();

        let j = 0;
        for(let i=0; i<lines.length; i++)
        {
            let angle: number;
            if(lines[i].colOriginal == 'green') 
            {
                angle = this.angleBetween(this.connectToTRUE);
            }
            else if(lines[i].colOriginal == 'orange') 
            {
                angle = this.angleBetween(this.connectToFALSE)
            }
            else 
            {
                angle = this.angleBetween(this.connectTo[j]);
            }

            let direction: string = lines[i].right_node[lines[i].right_node.length-1];
            const directionBeforeChange: string = direction;

            direction = newDirection(angle);

            if(direction == directionBeforeChange && force == false) continue;
            else 
            {
                if(lines[i].colOriginal == 'green')
                {
                    lines[i].right_node = this.connectToTRUE.id + direction;
                }
                else if(lines[i].colOriginal == 'orange')
                {
                    lines[i].right_node = this.connectToFALSE.id + direction;
                }
                else
                {
                    lines[i].right_node = this.connectTo[j].id + direction;
                    j++;
                }

                lines[i].left_node = this.id + reverseDirection(direction);
            }
        }
    }
}

class Condition {
    id: number;
    value1: any;
    value2: any;
    isValue1Variable: boolean;
    isValue2Variable: boolean;
    operator: string;

    constructor(id: number) {
        this.id = id;
        this.value1 = 0;
        this.value2 = 0;
        this.isValue1Variable = false;
        this.isValue2Variable = false;
        this.operator = "==";
    }

    add() {
        document.getElementById("conditions").innerHTML += `
            <p class="condition-section">
            <span class="value"><input type="text" value="${this.value1}" class="property${this.id}"></span>
            <select class="property${this.id}">
                        <option>==</option>
                        <option>!=</option>
                        <option>></option>
                        <option><</option>
                        <option>>=</option>
                        <option><=</option>
            </select>
            <span class="value"><input type="text" value="${this.value2}" class="property${this.id}"></span>
            </p>
            <p class="condition-section-var">
                <label><input type="checkbox" class="property${this.id}">Var</label>
                <label><input type="checkbox" class="property${this.id}">Var</label>
            </p>
        `;
    }
}