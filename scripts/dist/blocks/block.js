const workspace = document.getElementById("workspace");
const blocksList = [];
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
        this.properties();
        this.delete();
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
            if (this.connectTo.length <= 0) {
                runStatus = false;
                buttons.run.removeAttribute("disabled");
                return;
            }
            for (let i = 0; i < this.connectTo.length; i++) {
                if (executeHistory[executeHistory.length - 2] == this.connectTo[i]) {
                    if (this.connectTo.length <= 1) {
                        runStatus = false;
                        buttons.run.removeAttribute("disabled");
                    }
                    continue;
                }
                this.connectTo[i].execute();
            }
        }, runSpeed);
    }
    dragAndDrop() {
        let isdrag = false;
        let grabPointX;
        let grabPointY;
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 2) {
                document.querySelectorAll(".block").forEach((block) => block.style.cursor = 'cell');
                _canvas.style.cursor = 'cell';
            }
            if (e.button != 0)
                return;
            this.div.style.cursor = "grabbing";
            isdrag = true;
            grabPointY = this.div.getBoundingClientRect().top - e.clientY;
            grabPointX = this.div.getBoundingClientRect().left - e.clientX;
            globalVariablesUpdate();
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
            document.querySelectorAll(".block").forEach((block) => block.style.cursor = 'grab');
            _canvas.style.cursor = 'default';
            if (e.button != 0)
                return;
            isdrag = false;
        });
    }
    delete() {
        this.div.addEventListener("mousemove", () => {
            if (deleteLineMode == true) {
                this.div.style.border = "2px solid red";
                this.div.style.cursor = "crosshair";
            }
        });
        this.div.addEventListener("click", () => {
            if (deleteLineMode == true) {
                const connectToLength = this.connectTo.length;
                for (let i = 0; i < connectToLength; i++) {
                    for (let j = 0; j < _lines.length; j++) {
                        if (_lines[j].left_node == this.id || _lines[j].right_node == this.id) {
                            removeLine(j);
                            break;
                        }
                    }
                }
                workspace.removeChild(this.div);
                delete blocksList[this.id];
                propertiesWindow.innerHTML = '';
            }
        });
        this.div.addEventListener("mouseleave", () => {
            this.div.style.border = "";
        });
    }
    properties() { }
}
