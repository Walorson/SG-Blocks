class Block {
    constructor(x, y) {
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
        document.body.innerHTML += `<div class="block" id="${this.id}"></div>`;
    }
    setPosition(x, y) {
        this.div.style.top = y + "px";
        this.div.style.left = x + "px";
    }
    getID() {
        this.div = document.getElementById(this.id + "");
    }
    execute() {
        if (this.connectTo[0] != undefined) {
            this.connectTo[0].execute();
        }
    }
    connect() {
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
                this.div.style.top = y + "px";
                this.div.style.left = x + "px";
            }

            lineController.redrawLines();
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
        document.body.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
}
class End extends Block {
    constructor(x, y) {
        super(x, y);
        this.init();
    }
    createBlock() {
        document.body.innerHTML += `<div class="block end" id="${this.id}">End</div>`;
    }
}
class Output extends Block {
    constructor(x, y, message = "Hello World!") {
        super(x, y);
        this.message = message;
        this.init();
    }
    execute() {
        console.log(this.message);
        if (this.connectTo[0] != undefined) {
            this.connectTo[0].execute();
        }
    }
    createBlock() {
        document.body.innerHTML += `<div class="block output" id="${this.id}">${this.message}</div>`;
    }
}
const blocksList = [];
