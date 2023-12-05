const workspace = document.getElementById("workspace");
class Block {
    constructor(x, y) {
        this.maxConnects = 1;
        this.connectTo = [];
        this.id = blocksList.length;
        this.x = x;
        this.y = y;
        this.connectTo = [];
    }
    init() {
        this.createBlock();
        blocksList.push(this);
        blocksList.forEach((block) => {
            block.update();
        });
        this.setPosition(this.x, this.y);
    }
    update() {
        this.getID();
        this.connect();
        this.dragAndDrop();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block" id="${this.id}"></div>`;
    }
    setPosition(x, y) {
        this.div.style.top = y + "px";
        this.div.style.left = x + "px";
    }
    getID() {
        this.div = document.getElementById(this.id + "");
    }
    execute() { this.connectToExecute(); }
    connect() { }
    connectToExecute() {
        setTimeout(() => {
            executeHistory.push(this);
            for (let i = 0; i < this.connectTo.length; i++) {
                if (executeHistory[executeHistory.length - 2] == this.connectTo[i])
                    continue;
                this.connectTo[i].execute();
            }
        }, RUN_SPEED);
    }
    dragAndDrop() {
        let isdrag = false;
        let grabPointX;
        let grabPointY;
        this.div.addEventListener("mousedown", (e) => {
            if (e.button != 0)
                return;
            isdrag = true;
            grabPointY = this.div.getBoundingClientRect().top - e.clientY;
            grabPointX = this.div.getBoundingClientRect().left - e.clientX;
        });
        window.addEventListener("mousemove", (e) => {
            if (e.button != 0)
                return;
            if (isdrag) {
                let x = e.clientX + grabPointX;
                let y = e.clientY + grabPointY;
                this.x = x;
                this.y = y;
                this.div.style.top = y + "px";
                this.div.style.left = x + "px";
            }
        });
        window.addEventListener("mouseup", (e) => {
            if (e.button != 0)
                return;
            isdrag = false;
        });
    }
}
class StartBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
}
class EndBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block end" id="${this.id}">End</div>`;
    }
    execute() {
        console.warn("END");
    }
}
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
            console.log(globalVariables.get(this.message));
        }
        else {
            console.log(this.message);
        }
        this.connectToExecute();
    }
    createBlock() {
        if (this.isVariable) {
            workspace.innerHTML += `<div class="block output" id="${this.id}">Print: ${this.message}</div>`;
        }
        else {
            workspace.innerHTML += `<div class="block output" id="${this.id}">${this.message}</div>`;
        }
    }
}
class InputBlock extends Block {
    constructor(x, y, variableName, message = "Enter variable") {
        super(x, y);
        this.maxConnects = 2;
        this.message = message;
        this.variableName = variableName;
        globalVariables.set(this.variableName, null);
        this.init();
    }
    execute() {
        const variable = prompt(this.message);
        globalVariables.set(this.variableName, variable);
        this.connectToExecute();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block input" id="${this.id}">Input: <b>${this.variableName}</b></div>`;
    }
}
class ConditionBlock extends Block {
    constructor(x, y, value1 = 0, value2 = 0, operator = "==", isValue1Variable = false, isValue2Variable = false) {
        super(x, y);
        this.maxConnects = 3;
        this.value1 = value1;
        this.value2 = value2;
        this.operator = operator;
        this.isValue1Variable = isValue1Variable;
        this.isValue2Variable = isValue2Variable;
        if (this.isValue1Variable)
            this.value1Name = this.value1;
        if (this.isValue2Variable)
            this.value2Name = this.value2;
        this.init();
    }
    connectToExecute() {
        setTimeout(() => {
            executeHistory.push(this);
            if (this.isValue1Variable == true)
                this.value1 = globalVariables.get(this.value1Name);
            if (this.isValue2Variable == true)
                this.value2 = globalVariables.get(this.value2Name);
            if (this.connectTo[0] == undefined || this.connectTo[1] == undefined)
                return;
            switch (this.operator) {
                case "==":
                    if (this.value1 == this.value2)
                        this.connectTo[1].execute();
                    else if (this.connectTo[2] != undefined)
                        this.connectTo[2].execute();
                    break;
            }
        }, RUN_SPEED);
    }
    createBlock() {
        workspace.innerHTML += `<div class="block condition" id="${this.id}">IF</div>`;
    }
}
const blocksList = [];
