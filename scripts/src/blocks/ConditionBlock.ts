class ConditionBlock extends Block {
    conditions: Condition[] = [];
    connectToTRUE: Block | any;
    connectToFALSE: Block | any;

    constructor(x: number = 0, y: number = 0, conditions: Condition[] = null) {
        super(x, y);

        this.init();
        if(conditions == null)
            this.conditions = [new Condition(this.id)];
        else {
            for(let i=0; i<conditions.length; i++) {
                
            }
        }
            
        
        this.updateDiv();
    }

    connectToExecute(): void {
        window.removeEventListener("keypress", this.executeOnSpacePress);
        setTimeout(() => 
        {
            executeHistory.push(this);
            this.unsetActive();

            this.conditions.forEach((condition: Condition) => {
                condition.compare();
            });

            let result: boolean = false;
            let conditionsResult: string = "";
            let op: string = '&&';
            const conditions: Condition[] = this.conditions.filter((condition: Condition) => condition != null);

            for(let i=0; i<conditions.length-1; i++)
            {
                if(conditions[i+1].logicalOperator == 'OR') op = '||';

                conditionsResult += conditions[i].result + " " + op + " ";
            }
            conditionsResult += conditions[conditions.length-1].result;

            /////////////////////////////////////////
            if(eval(conditionsResult)) result = true;
            /////////////////////////////////////////

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
        `<div class="block condition" id="${this.id}" title="Z - Linia prawda\nX - Linia Fałsz"></div>`;
    }

    updateDiv(): void {
        let conditions: string = "";

        let conditionsWithoutEmptys: Condition[] = this.conditions.filter((condition: Condition) => condition != null);

        conditionsWithoutEmptys.forEach((condition: Condition, index: number) => 
        {
            if(condition.isValueVariable[0] == true && condition.isValueVariable[1] == true)
            {
                conditions += `<b>${condition.valueName[0]}</b>${condition.operator}<b>${condition.valueName[1]}</b>`;
            }
            else if(condition.isValueVariable[0] == true)
            {
                conditions += `<b>${condition.valueName[0]}</b>${condition.operator}${condition.value[1]}`;
            }
            else if(condition.isValueVariable[1] == true)
            {
                conditions += `${condition.value[0]}${condition.operator}<b>${condition.valueName[1]}</b>`;
            }
            else
            {
                conditions += `${condition.value[0]}${condition.operator}${condition.value[1]}`;
            }

            if(index < conditionsWithoutEmptys.length-1) conditions += ` ${conditionsWithoutEmptys[index+1].logicalOperator} `;
        });

        this.div.innerHTML = `<span>${conditions}</span>`;

        this.resize();
        super.updateDiv();
    }

    resize(): void {
        this.div.style.width = (this.div.textContent.length*16)+"px";
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

            const addCondition: HTMLElement = document.getElementById("add-condition-button");

            addCondition.onclick = () => {
                this.conditions.push(new Condition(this.id));
                this.conditions[this.conditions.length-1].add();

                this.conditions.forEach((condition: Condition) => {
                    condition.update();
                });

                this.updateDiv();
            }

            this.conditions.forEach((condition: Condition) => {
                condition.update();
            });

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
    idBlock: number;
    value: any[];
    operator: string;
    isValueVariable: boolean[];
    valueName: string[];
    result: boolean;
    logicalOperator: string;

    constructor(idBlock: number) {
        this.idBlock = idBlock;
        this.id = blocksList[idBlock].conditions.length;
        this.value = [0, 0]
        this.isValueVariable = [false, false];
        this.operator = "==";
        if(this.id > 0) {
            this.logicalOperator = 'AND';
        }
        else {
            this.logicalOperator = null;
        }
        this.valueName = [];

        for(let i=0; i<this.isValueVariable.length; i++)
        {
            if(this.isValueVariable[i] == true) this.valueName[i] = this.value[i];
        }
    }

    add() {
        document.getElementById("conditions").innerHTML += `<div id="condition${this.id}" class="condition-setting"></div>`;

        if(this.id > 0)
        {
            document.getElementById("condition"+this.id).innerHTML += `
            <select id="logicalOperator${this.id}">
                <option>AND</option>
                <option>OR</option>
            </select>
            `;
        }

        document.getElementById("condition"+this.id).innerHTML += `
            <p class="condition-section">
            <span class="value${this.id}"><input type="text" value="${this.value[0]}" class="property${this.id}"></span>
            <select class="property${this.id}">
                        <option>==</option>
                        <option>!=</option>
                        <option>></option>
                        <option><</option>
                        <option>>=</option>
                        <option><=</option>
            </select>
            <span class="value${this.id}"><input type="text" value="${this.value[1]}" class="property${this.id}"></span>
            </p>
            <p class="condition-section-var">
                <label><input type="checkbox" class="property${this.id}">Var</label>
                <label><input type="checkbox" class="property${this.id}">Var</label>
            </p>
            <div class="remove-condition" id="remove-condition${this.id}"><img src="img/remove.png"></div>
        `;
    }

    update() {
        let property: any = propertiesWindow.querySelectorAll(".property"+this.id);
        const value: any = propertiesWindow.querySelectorAll(".value"+this.id);

        property[0].value = this.value[0];
        property[1].value = this.operator;
        property[2].value = this.value[1];

        property[0].oninput = () => {
            this.value[0] = property[0].value;
            blocksList[this.idBlock].updateDiv();
        }
        for(let i=0; i<this.isValueVariable.length; i++)
        {
            let id: number = 3+i;

            property[id].onchange = () => {
                if(property[id].checked)
                {
                    value[i].innerHTML = createSelectVariables("property"+this.id, undefined, true);

                    property = propertiesWindow.querySelectorAll(".property"+this.id);
                    property[i*2].oninput = () => {
                        
                        if(property[i*2].value != "---")
                        {
                            this.isValueVariable[i] = true;
                            this.valueName[i] = property[i*2].value;
                        }
                        else
                        {
                            this.isValueVariable[i] = false;
                        }

                        blocksList[this.idBlock].updateDiv();
                    }
                }
                else
                {
                    this.isValueVariable[i] = false;

                    value[i].innerHTML = `<input type="text" value="${this.value[i]}" class="property${this.id}">`;
                    property = propertiesWindow.querySelectorAll(".property"+this.id);
                    property[i*2].oninput = () => {
                        this.value[i] = property.value;
                        blocksList[this.idBlock].updateDiv();
                    }
                }

                blocksList[this.idBlock].updateDiv();
            }
        }
        property[2].oninput = () => {
            this.value[1] = property[2].value;
            blocksList[this.idBlock].updateDiv();
        }

        property[1].oninput = () => {
            this.operator = property[1].value;
            blocksList[this.idBlock].updateDiv();
        }

        for(let i=0; i<this.isValueVariable.length; i++)
        {
            let id: number = i+3;

            if(this.isValueVariable[i] == true) 
            {
                property[id].checked = true; 
                value[i].innerHTML = createSelectVariables("property"+this.id, undefined, true);

                property = propertiesWindow.querySelectorAll(".property"+this.id);
                property[i*2].value = this.valueName[i];

                property[i*2].oninput = () => {
                    if(property[i*2].value != "---")
                    {
                        this.isValueVariable[i] = true;
                        this.valueName[i] = property[i*2].value;
                    }
                    else
                    {
                        this.isValueVariable[i] = false;
                        this.value[i] = 0;
                    }
                    blocksList[this.idBlock].updateDiv();
                }
            }
        }

        document.getElementById(`remove-condition${this.id}`).onclick = () => 
        {
            document.getElementById(`condition${this.id}`).remove();
            delete blocksList[this.idBlock].conditions[this.id];
            blocksList[this.idBlock].updateDiv();

            for(let i=0; i < blocksList[this.idBlock].conditions.length; i++)
            {
                if(blocksList[this.idBlock].conditions[i] != null) {
                    try {
                        document.getElementById("logicalOperator"+blocksList[this.idBlock].conditions[i].id).remove();
                    } catch{};
                    return; //end the function if there aren't only emptys
                }
            }

            blocksList[this.idBlock].conditions = [];
        }

        if(this.id > 0)
        {
            const logicalOperator: any = document.getElementById(`logicalOperator${this.id}`);

            logicalOperator.value = this.logicalOperator;

            logicalOperator.oninput = () => {
                this.logicalOperator = logicalOperator.value;
                blocksList[this.idBlock].updateDiv();
            }
        }
    }

    compare() {
        for(let i = 0; i < this.isValueVariable.length; i++)
        {
            if(this.isValueVariable[i] == true) this.value[i] = globalVariables.get(this.valueName[i]);
        }

        if(isNaN(Number(this.value[0])) == false)
            this.value[0] = Number(this.value[0]);
        
        if(isNaN(Number(this.value[1])) == false)
            this.value[1] = Number(this.value[1]);

        this.result = false;

        switch(this.operator)
        {
            case "==":
                if(this.value[0] == this.value[1]) this.result = true;
            break;

            case "!=":
                if(this.value[0] != this.value[1]) this.result = true;
            break;

            case ">":
                if(this.value[0] > this.value[1]) this.result = true;
            break;

            case "<":
                if(this.value[0] < this.value[1]) this.result = true;
            break;

            case "<=":
                if(this.value[0] <= this.value[1]) this.result = true;
            break;

            case ">=":
                if(this.value[0] >= this.value[1]) this.result = true;
            break;
        }
    }
}