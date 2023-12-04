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
    execute() { setTimeout(() => { this.connectToExecute(); }, 500); }
    connect() { }
    connectToExecute() {
        executeHistory.push(this);
        for (let i = 0; i < this.connectTo.length; i++) {
            if (executeHistory[executeHistory.length - 2] == this.connectTo[i])
                continue;
            this.connectTo[i].execute();
        }
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
class Start extends Block {
    constructor(x, y) {
        super(x, y);
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
}
class End extends Block {
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
class Output extends Block {
    constructor(x, y, message = "Hello World!") {
        super(x, y);
        this.maxConnects = 2;
        this.message = message;
        this.init();
    }
    execute() {
        console.log(this.message);
        setTimeout(() => { this.connectToExecute(); }, 500);
    }
    createBlock() {
        workspace.innerHTML += `<div class="block output" id="${this.id}">${this.message}</div>`;
    }
}
const blocksList = [];
