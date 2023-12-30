class ConditionBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.value = [0, 0];
        this.operator = "==";
        this.isValueVariable = [false, false];
        this.valueName = [];
        for (let i = 0; i < this.isValueVariable.length; i++) {
            if (this.isValueVariable[i] == true)
                this.valueName[i] = this.value[i];
        }
        this.init();
    }
    connectToExecute() {
        setTimeout(() => {
            executeHistory.push(this);
            this.unsetActive();
            for (let i = 0; i < this.isValueVariable.length; i++) {
                if (this.isValueVariable[i] == true)
                    this.value[i] = globalVariables.get(this.valueName[i]);
            }
            let result = false;
            if (isNaN(Number(this.value[0])) == false)
                this.value[0] = Number(this.value[0]);
            if (isNaN(Number(this.value[1])) == false)
                this.value[1] = Number(this.value[1]);
            switch (this.operator) {
                case "==":
                    if (this.value[0] == this.value[1])
                        result = true;
                    break;
                case "!=":
                    if (this.value[0] != this.value[1])
                        result = true;
                    break;
                case ">":
                    if (this.value[0] > this.value[1])
                        result = true;
                    break;
                case "<":
                    if (this.value[0] < this.value[1])
                        result = true;
                    break;
                case "<=":
                    if (this.value[0] <= this.value[1])
                        result = true;
                    break;
                case ">=":
                    if (this.value[0] >= this.value[1])
                        result = true;
                    break;
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
        workspace.innerHTML += `<div class="block condition" id="${this.id}" title="Z - Linia prawda\nX - Linia Fałsz"><p>IF</p><p>${this.value[0]}${this.operator}${this.value[1]}</p></div>`;
    }
    updateDiv() {
        if (this.isValueVariable[0] == true && this.isValueVariable[1] == true) {
            this.div.innerHTML = `<p>IF</p><p><b>${this.valueName[0]}</b>${this.operator}<b>${this.valueName[1]}</b></p>`;
            ;
        }
        else if (this.isValueVariable[0] == true) {
            this.div.innerHTML = `<p>IF</p><p><b>${this.valueName[0]}</b>${this.operator}${this.value[1]}</p>`;
            ;
        }
        else if (this.isValueVariable[1] == true) {
            this.div.innerHTML = `<p>IF</p><p>${this.value[0]}${this.operator}<b>${this.valueName[1]}</b></p>`;
            ;
        }
        else {
            this.div.innerHTML = `<p>IF</p><p>${this.value[0]}${this.operator}${this.value[1]}</p>`;
            ;
        }
    }
    properties() {
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
            let property = propertiesWindow.querySelectorAll(".property" + this.id);
            const value = propertiesWindow.querySelectorAll(".value");
            property[0].oninput = () => {
                this.value[0] = property[0].value;
                this.updateDiv();
            };
            for (let i = 0; i < this.isValueVariable.length; i++) {
                let id = 2 * i + 1;
                property[id].onchange = () => {
                    if (property[id].checked) {
                        value[i].innerHTML = createSelectVariables("property" + i);
                        const property = document.getElementById("property" + i);
                        property.oninput = () => {
                            if (property.value != "---") {
                                this.isValueVariable[i] = true;
                                this.valueName[i] = property.value;
                            }
                            else {
                                this.isValueVariable[i] = false;
                            }
                            this.updateDiv();
                        };
                    }
                    else {
                        this.isValueVariable[i] = false;
                        value[i].innerHTML = `<input type="text" value="${this.value[i]}" id="property${i}">`;
                        const property = document.getElementById("property" + i);
                        property.oninput = () => {
                            this.value[i] = property.value;
                            this.updateDiv();
                        };
                    }
                    this.updateDiv();
                };
            }
            property[2].oninput = () => {
                this.value[1] = property[2].value;
                this.updateDiv();
            };
            property[4].oninput = () => {
                this.operator = property[4].value;
                this.updateDiv();
            };
            property[4].value = this.operator;
            for (let i = 0; i < this.isValueVariable.length; i++) {
                if (this.isValueVariable[i] == true) {
                    property[2 * i + 1].checked = true;
                    value[i].innerHTML = createSelectVariables("property" + i);
                    let propertyX = document.getElementById("property" + i);
                    propertyX.value = this.valueName[i];
                    propertyX.oninput = () => {
                        if (property.value != "---") {
                            this.isValueVariable[i] = true;
                            this.valueName[i] = propertyX.value;
                        }
                        else {
                            this.isValueVariable[i] = false;
                            this.value[i] = 0;
                        }
                        this.updateDiv();
                    };
                }
            }
            super.properties();
        });
    }
}
