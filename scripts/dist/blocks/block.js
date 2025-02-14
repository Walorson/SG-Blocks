const workspace = document.getElementById("workspace");
let DEFAULT_BLOCK_X = 250;
let DEFAULT_BLOCK_Y = 75;
let blocksList = [];
class Block {
    constructor(x = 0, y = 0) {
        this.maxConnects = 64;
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
        if (copyMode == true)
            return;
        blocksList.forEach((block) => {
            block.update();
        });
        this.move(this.x, this.y);
        this.updateDiv();
    }
    update() {
        if (copyMode == true)
            return;
        this.getID();
        this.dragAndDrop();
        this.selectEvent();
        this.properties();
        this.delete();
    }
    updateDiv() { this.addConnectPoints(); }
    createBlock() {
        workspace.innerHTML += `<div class="block" id="${this.id}"></div>`;
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
        this.div.onmousedown = (e) => {
            if (e.button == 0)
                saveBlockState();
        };
        this.div.onmousemove = (e) => {
            cursorX = this.x + e.offsetX + 1;
            cursorY = this.y + e.offsetY + 1;
            displayCoords();
        };
        window.addEventListener("mousedown", (e) => {
            setTimeout(() => {
                let elementClicked = e.target;
                if (elementClicked.tagName == 'B')
                    elementClicked = elementClicked.parentElement;
                if (elementClicked.tagName == 'I')
                    elementClicked = elementClicked.parentElement;
                if (elementClicked.tagName == 'SPAN')
                    elementClicked = elementClicked.parentElement;
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
            if (e.button == 2 && this.connectTo.length < this.maxConnects) {
                document.querySelectorAll(".block").forEach((block) => block.style.cursor = 'cell');
                _canvas.style.cursor = 'cell';
            }
            if (e.button != 0 || deleteLineMode == true)
                return;
            this.div.style.cursor = "grabbing";
            isdrag = true;
            grabPointY = this.div.getBoundingClientRect().top - e.clientY;
            grabPointX = this.div.getBoundingClientRect().left - e.clientX;
        };
        const mouseMove = (e) => {
            if (e.button != 0 || workspaceMove.isMove == true)
                return;
            if (isdrag) {
                let x = e.clientX + grabPointX - workspaceMove.translateX;
                let y = e.clientY + grabPointY - workspaceMove.translateY;
                if (grid.snap == true) {
                    x = Math.round(x / 25) * 25;
                    y = Math.round(y / 25) * 25;
                }
                this.x = x;
                this.y = y;
                this.div.style.top = y + "px";
                this.div.style.left = x + "px";
                blocksList.forEach((block) => {
                    if (block != undefined) {
                        block.updateConnectPoint();
                    }
                });
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
                this.div.style.borderColor = "red";
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
        document.querySelectorAll("input, textarea").forEach((input) => {
            input.onfocus = () => { isInputFocus = true; };
            input.onblur = () => { isInputFocus = false; };
        });
    }
    deleteBlock(forceDeletion = false, multipleDeletion = false, dontSaveBlockState = false) {
        if (this.isDeletable == false && forceDeletion == false)
            return;
        if (forceDeletion == false && multipleDeletion == false)
            saveBlockState();
        let linesRemoved = 0;
        for (let j = 0; j < _lines.length; j++) {
            if (_lines[j].left_node_id == this.id || _lines[j].right_node_id == this.id) {
                removeLine(j, dontSaveBlockState);
                linesRemoved++;
                j = -1;
            }
        }
        this.div.remove();
        delete blocksList[this.id];
        propertiesWindow.innerHTML = '';
    }
    selectEvent() {
        this.div.addEventListener("mousedown", (e) => {
            if (shiftPressed == false && e.button != 1 && this.isSelected() == false)
                unselectAllBlocks();
            this.setSelected();
        });
    }
    move(x, y) {
        this.x = x;
        this.y = y;
        this.div.style.top = y + "px";
        this.div.style.left = x + "px";
    }
    addConnectPoints() {
        this.div.innerHTML +=
            `<div class="connectPoint" id="${this.id}n"></div>
        <div class="connectPoint" id="${this.id}e"></div>
        <div class="connectPoint" id="${this.id}s"></div>
        <div class="connectPoint" id="${this.id}w"></div>`;
    }
    updateConnectPoint(force = false) {
        if (this.connectTo.length <= 0)
            return;
        const lines = this.getLines();
        for (let i = 0; i < lines.length; i++) {
            let angle = this.angleBetween(this.connectTo[i]);
            let direction = lines[i].right_node[lines[i].right_node.length - 1];
            const directionBeforeChange = direction;
            direction = newDirection(angle);
            if (direction == directionBeforeChange && force == false)
                continue;
            else {
                lines[i].right_node = this.connectTo[i].id + direction;
                lines[i].left_node = this.id + reverseDirection(direction);
            }
        }
    }
    setActive() {
        this.div.classList.add("active");
        if (settings.workspaceMoveDuringRun == true)
            moveWorkspaceTo(this);
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
    getCenter() {
        return {
            x: this.x + this.div.clientWidth / 2,
            y: this.y + this.div.clientHeight / 2
        };
    }
    angleBetween(block) {
        const center1 = this.getCenter();
        const center2 = block.getCenter();
        const angleRad = Math.atan2(center2.y - center1.y, center2.x - center1.x);
        let angleDegree = (180 * angleRad) / Math.PI;
        if (angleDegree < 0)
            angleDegree += 360;
        return angleDegree;
    }
    getLines() {
        const lines = [];
        _lines.forEach((line) => {
            if (line.left_node_id == this.id) {
                lines.push(line);
            }
        });
        return lines;
    }
}
