class ConditionBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.conditions = [];
        this.init();
        this.conditions = [new Condition(this.id)];
        this.updateDiv();
    }
    connectToExecute() {
        window.removeEventListener("keypress", this.executeOnSpacePress);
        setTimeout(() => {
            executeHistory.push(this);
            this.unsetActive();
            this.conditions.forEach((condition) => {
                condition.compare();
            });
            let result = true;
            for (let i = 0; i < this.conditions.length; i++) {
                if (this.conditions[i].result == false) {
                    result = false;
                    break;
                }
            }
            if (result == true && this.connectToTRUE != undefined)
                this.connectToTRUE.execute();
            else if (result == false && this.connectToFALSE != undefined)
                this.connectToFALSE.execute();
            else if (this.connectToTRUE == undefined && this.connectToFALSE == undefined) {
                for (let i = 0; i < this.connectTo.length; i++) {
                    this.connectTo[i].execute();
                }
            }
            else
                endRun();
        }, runSpeed);
    }
    createBlock() {
        workspace.innerHTML +=
            `<div class="block condition" id="${this.id}" title="Z - Linia prawda\nX - Linia Fałsz"></div>`;
    }
    updateDiv() {
        let conditions = "";
        this.conditions.forEach((condition, index) => {
            conditions += `${condition.value[0]}${condition.operator}${condition.value[1]}`;
            if (index < this.conditions.length - 1)
                conditions += ' && ';
        });
        this.div.innerHTML = `<span>${conditions}</span>`;
        this.resize();
        super.updateDiv();
    }
    resize() {
        this.div.style.width = (this.div.textContent.length * 14) + "px";
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <div id="conditions"></div>

                <p><button id="add-condition-button">Add condition</button></p>
            `;
            this.conditions.forEach((condition) => {
                condition.add();
            });
            const addCondition = document.getElementById("add-condition-button");
            addCondition.onclick = () => {
                this.conditions.push(new Condition(this.id));
                this.conditions[this.conditions.length - 1].add();
                this.conditions.forEach((condition) => {
                    condition.update();
                    this.updateDiv();
                });
            };
            this.conditions.forEach((condition) => {
                condition.update();
            });
            super.properties();
        });
    }
    updateConnectPoint(force = false) {
        if (this.connectTo.length <= 0 && this.connectToTRUE == undefined && this.connectToFALSE == undefined)
            return;
        const lines = this.getLines();
        let j = 0;
        for (let i = 0; i < lines.length; i++) {
            let angle;
            if (lines[i].colOriginal == 'green') {
                angle = this.angleBetween(this.connectToTRUE);
            }
            else if (lines[i].colOriginal == 'orange') {
                angle = this.angleBetween(this.connectToFALSE);
            }
            else {
                angle = this.angleBetween(this.connectTo[j]);
            }
            let direction = lines[i].right_node[lines[i].right_node.length - 1];
            const directionBeforeChange = direction;
            direction = newDirection(angle);
            if (direction == directionBeforeChange && force == false)
                continue;
            else {
                if (lines[i].colOriginal == 'green') {
                    lines[i].right_node = this.connectToTRUE.id + direction;
                }
                else if (lines[i].colOriginal == 'orange') {
                    lines[i].right_node = this.connectToFALSE.id + direction;
                }
                else {
                    lines[i].right_node = this.connectTo[j].id + direction;
                    j++;
                }
                lines[i].left_node = this.id + reverseDirection(direction);
            }
        }
    }
}
class Condition {
    constructor(idBlock) {
        this.idBlock = idBlock;
        this.id = blocksList[idBlock].conditions.length;
        this.value = [0, 0];
        this.isValueVariable = [false, false];
        this.operator = "==";
        this.valueName = [];
        for (let i = 0; i < this.isValueVariable.length; i++) {
            if (this.isValueVariable[i] == true)
                this.valueName[i] = this.value[i];
        }
    }
    add() {
        if (this.id > 0) {
            document.getElementById("conditions").innerHTML += `
            <select>
                <option>AND</option>
            </select>
            `;
        }
        document.getElementById("conditions").innerHTML += `
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
        `;
    }
    update() {
        let property = propertiesWindow.querySelectorAll(".property" + this.id);
        const value = propertiesWindow.querySelectorAll(".value" + this.id);
        property[0].value = this.value[0];
        property[1].value = this.operator;
        property[2].value = this.value[1];
        property[0].oninput = () => {
            this.value[0] = property[0].value;
            blocksList[this.idBlock].updateDiv();
        };
        for (let i = 0; i < this.isValueVariable.length; i++) {
            let id = 3 + i;
            property[id].onchange = () => {
                if (property[id].checked) {
                    value[i].innerHTML = createSelectVariables("property" + this.id, undefined, true);
                    property = propertiesWindow.querySelectorAll(".property" + this.id);
                    property[id].oninput = () => {
                        if (property.value != "---") {
                            this.isValueVariable[i] = true;
                            this.valueName[i] = property.value;
                        }
                        else {
                            this.isValueVariable[i] = false;
                        }
                        blocksList[this.idBlock].updateDiv();
                    };
                }
                else {
                    this.isValueVariable[i] = false;
                    value[i].innerHTML = `<input type="text" value="${this.value[i]}" class="property${this.id}">`;
                    property = propertiesWindow.querySelectorAll(".property" + this.id);
                    property[id].oninput = () => {
                        this.value[i] = property.value;
                        blocksList[this.idBlock].updateDiv();
                    };
                }
                blocksList[this.idBlock].updateDiv();
            };
        }
        property[2].oninput = () => {
            this.value[1] = property[2].value;
            blocksList[this.idBlock].updateDiv();
        };
        property[1].oninput = () => {
            this.operator = property[1].value;
            blocksList[this.idBlock].updateDiv();
        };
        /*for(let i=0; i<this.isValueVariable.length; i++)
        {
            let id: number = i+3;

            if(this.isValueVariable[i] == true)
            {
                property[id].checked = true;
                value[i].innerHTML = createSelectVariables("property"+this.id, undefined, true);

                let propertyX: any = document.getElementById("property"+this.id);
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
                    blocksList[this.idBlock].updateDiv();
                }

            }
        }*/
    }
    compare() {
        for (let i = 0; i < this.isValueVariable.length; i++) {
            if (this.isValueVariable[i] == true)
                this.value[i] = globalVariables.get(this.valueName[i]);
        }
        if (isNaN(Number(this.value[0])) == false)
            this.value[0] = Number(this.value[0]);
        if (isNaN(Number(this.value[1])) == false)
            this.value[1] = Number(this.value[1]);
        this.result = false;
        switch (this.operator) {
            case "==":
                if (this.value[0] == this.value[1])
                    this.result = true;
                break;
            case "!=":
                if (this.value[0] != this.value[1])
                    this.result = true;
                break;
            case ">":
                if (this.value[0] > this.value[1])
                    this.result = true;
                break;
            case "<":
                if (this.value[0] < this.value[1])
                    this.result = true;
                break;
            case "<=":
                if (this.value[0] <= this.value[1])
                    this.result = true;
                break;
            case ">=":
                if (this.value[0] >= this.value[1])
                    this.result = true;
                break;
        }
    }
}
