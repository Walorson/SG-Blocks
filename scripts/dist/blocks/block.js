const workspace = document.getElementById("workspace");
let DEFAULT_BLOCK_X = 250;
let DEFAULT_BLOCK_Y = 75;
const blocksList = [];
class Block {
    constructor(x, y) {
        this.maxConnects = 10;
        this.connectTo = [];
        this.isDeletable = true;
        this.id = blocksList.length;
        this.x = x;
        this.y = y;
        this.connectTo = [];
        this.executeOnSpacePress = (e) => {
            if (e.key == ' ')
                this.connectToExecute();
        };
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
        this.dragAndDrop();
        this.properties();
        this.delete();
    }
    updateDiv() { }
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
    execute() {
        this.setActive();
        this.executeNextBlock();
    }
    executeNextBlock() {
        if (runStatus == false)
            return;
        if (autorun == true) {
            this.connectToExecute();
        }
        else {
            window.addEventListener("keypress", this.executeOnSpacePress);
        }
    }
    connectToExecute() {
        window.removeEventListener("keypress", this.executeOnSpacePress);
        setTimeout(() => {
            executeHistory.push(this);
            if (this.connectTo.length <= 0) {
                endRun();
                return;
            }
            for (let i = 0; i < this.connectTo.length; i++) {
                this.connectTo[i].execute();
            }
            this.unsetActive();
        }, runSpeed);
    }
    dragAndDrop() {
        let isdrag = false;
        let grabPointX;
        let grabPointY;
        this.div.addEventListener("mousedown", (e) => {
            mouseDown(e);
        });
        window.addEventListener("mousedown", (e) => {
            setTimeout(() => {
                const elementClicked = e.target;
                if (this.isSelected() && elementClicked.classList.contains("selected")) {
                    mouseDown(e);
                }
            }, 5);
        });
        window.addEventListener("mousemove", (e) => {
            mouseMove(e);
        });
        window.addEventListener("mouseup", (e) => {
            mouseUp(e);
        });
        const mouseDown = (e) => {
            if (e.button == 2) {
                document.querySelectorAll(".block").forEach((block) => block.style.cursor = 'cell');
                _canvas.style.cursor = 'cell';
            }
            if (e.button != 0 || deleteLineMode == true)
                return;
            this.div.style.cursor = "grabbing";
            isdrag = true;
            grabPointY = this.div.getBoundingClientRect().top - e.clientY;
            grabPointX = this.div.getBoundingClientRect().left - e.clientX;
            globalVariablesUpdate();
        };
        const mouseMove = (e) => {
            if (e.button != 0)
                return;
            if (isdrag) {
                let x = e.clientX + grabPointX - workspaceMove.translateX;
                let y = e.clientY + grabPointY - workspaceMove.translateY;
                this.x = x;
                this.y = y;
                this.div.style.top = y + "px";
                this.div.style.left = x + "px";
            }
        };
        const mouseUp = (e) => {
            document.querySelectorAll(".block").forEach((block) => block.style.cursor = 'grab');
            _canvas.style.cursor = 'default';
            if (e.button != 0)
                return;
            isdrag = false;
        };
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
                this.deleteBlock();
            }
        });
        this.div.addEventListener("mouseleave", () => {
            this.div.style.border = "";
        });
    }
    properties() {
        document.querySelectorAll("input").forEach((input) => {
            input.onfocus = () => { isInputFocus = true; };
            input.onblur = () => { isInputFocus = false; };
        });
    }
    deleteBlock() {
        if (this.isDeletable == false)
            return;
        for (let j = 0; j < _lines.length; j++) {
            if (_lines[j].left_node == this.id || _lines[j].right_node == this.id) {
                removeLine(j);
                j = -1;
            }
        }
        workspace.removeChild(this.div);
        delete blocksList[this.id];
        propertiesWindow.innerHTML = '';
    }
    setActive() {
        this.div.classList.add("active");
    }
    unsetActive() {
        this.div.classList.remove("active");
    }
    setSelected() {
        this.div.classList.add("selected");
    }
    unsetSelected() {
        this.div.classList.remove("selected");
    }
    isSelected() {
        if (this.div.classList.contains("selected"))
            return true;
        else
            return false;
    }
}
