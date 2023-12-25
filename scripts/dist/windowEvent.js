let removeLine;
window.addEventListener("load", () => {
    let connectStart = false;
    let blockStart;
    let lineHoverID = null;
    let lineController = connect();
    let keyPressed = null;
    let shiftPressed = false;
    window.addEventListener("mousedown", (e) => {
        const elementClicked = e.target;
        if (elementClicked.classList.contains("selected") == false && shiftPressed == false)
            unselectAllBlocks();
        if (elementClicked.classList.contains("block"))
            elementClicked.classList.add("selected");
        connectBegin(e);
        selectBegin(e);
        removeLine(lineHoverID);
    });
    window.addEventListener("mouseup", (e) => {
        if (selectStart == true)
            selectEnd(e);
        connectEnd(e);
    });
    window.addEventListener("mousemove", (e) => {
        fakeCursorToRealCursor(e);
        if (selectStart == true)
            selectResize(e);
        if (deleteLineMode == true)
            showDeletePossibilities(e);
        else
            document.body.style.cursor = "default";
        lineController.redrawLines();
    });
    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey) {
            deleteLineMode = true;
            _canvas.style.cursor = "crosshair";
        }
        keyPressed = e.key.toUpperCase();
        if (e.shiftKey)
            shiftPressed = true;
        else
            shiftPressed = false;
    });
    window.addEventListener("keyup", (e) => {
        deleteLineMode = false;
        shiftPressed = false;
        for (let i = 0; i < _lines.length; i++) {
            _lines[i].col = _lines[i].colOriginal;
        }
        _canvas.style.cursor = "default";
        document.querySelectorAll(".block").forEach((block) => {
            block.style.cursor = "";
            block.style.border = "";
        });
        lineController.redrawLines();
        keyPressed = null;
    });
    removeLine = (id) => {
        if (id == null || deleteLineMode == false)
            return;
        const left_node = blocksList[_lines[id].left_node];
        const right_node = blocksList[_lines[id].right_node];
        const leftPos = left_node.connectTo.indexOf(right_node);
        const rightPos = right_node.connectTo.indexOf(left_node);
        delete left_node.connectTo[leftPos];
        delete right_node.connectTo[rightPos];
        if (_lines[id].colOriginal == 'green')
            blocksList[_lines[id].left_node].connectToTRUE = undefined;
        else if (_lines[id].colOriginal == 'orange')
            blocksList[_lines[id].left_node].connectToFALSE = undefined;
        delete _lines[id];
        _lines = _lines.filter(item => item != undefined);
        left_node.connectTo = left_node.connectTo.filter((item) => item != undefined);
        right_node.connectTo = right_node.connectTo.filter((item) => item != undefined);
        _ctx.clearRect(0, 0, 10000, 4300);
        lineController.redrawLines();
    };
    function connectBegin(e) {
        if (e.button != 2)
            return;
        e.preventDefault();
        let block = document.elementFromPoint(e.clientX, e.clientY);
        if (block.tagName == 'B' || block.tagName == 'I') {
            block = block.parentElement;
        }
        let id = Number(block.getAttribute("id"));
        if (isNaN(id) == false && block.tagName == "DIV") {
            if (blocksList[id].connectTo.length < blocksList[id].maxConnects) {
                blockStart = blocksList[id];
                connectStart = true;
                lineController.drawLine({
                    left_node: blockStart.id,
                    right_node: "cursor",
                    col: "black",
                    colOriginal: "black",
                    width: 2,
                    gtype: "D"
                });
            }
        }
    }
    function connectEnd(e) {
        if (connectStart == false || e.button != 2)
            return;
        delete _lines[_lines.length - 1];
        _lines = _lines.filter(line => line != undefined);
        _ctx.clearRect(0, 0, 10000, 4300);
        const connected = Number(document.elementFromPoint(e.clientX, e.clientY).getAttribute("id"));
        if (isNaN(connected) == false && blocksList[connected].connectTo.length < blocksList[connected].maxConnects) {
            const blockEnd = blocksList[connected];
            if (blockEnd == blockStart)
                return;
            let isBlockRepeat = false;
            blockStart.connectTo.forEach((block) => {
                if (block == blockEnd)
                    isBlockRepeat = true;
            });
            if (isBlockRepeat == true)
                return;
            if (blockStart instanceof ConditionBlock) {
                if (keyPressed == 'Z' && blockStart.connectToTRUE == undefined) {
                    lineController.drawLine({
                        left_node: blockStart.id,
                        right_node: blockEnd.id,
                        col: "green",
                        colOriginal: "green",
                        width: 3,
                        gtype: "D"
                    });
                    blockStart.connectToTRUE = blockEnd;
                }
                else if (keyPressed == 'X' && blockStart.connectToFALSE == undefined) {
                    lineController.drawLine({
                        left_node: blockStart.id,
                        right_node: blockEnd.id,
                        col: "orange",
                        colOriginal: "orange",
                        width: 3,
                        gtype: "D"
                    });
                    blockStart.connectToFALSE = blockEnd;
                }
                else {
                    lineController.drawLine({
                        left_node: blockStart.id,
                        right_node: blockEnd.id,
                        col: "black",
                        colOriginal: "black",
                        width: 2,
                        gtype: "D"
                    });
                    blockStart.connectTo.push(blockEnd);
                }
            }
            else {
                lineController.drawLine({
                    left_node: blockStart.id,
                    right_node: blockEnd.id,
                    col: "black",
                    colOriginal: "black",
                    width: 2,
                    gtype: "D"
                });
                blockStart.connectTo.push(blockEnd);
            }
        }
        connectStart = false;
    }
    function showDeletePossibilities(e) {
        const id = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");
        if (isNaN(Number(id)) == false) {
            for (let i = 0; i < _lines.length; i++) {
                _lines[i].col = _lines[i].colOriginal;
            }
            lineHoverID = null;
            lineController.redrawLines();
            return;
        }
        for (let i = 0; i < _lines.length; i++) {
            if ((e.clientX >= blocksList[_lines[i].left_node].x + 20 && e.clientX <= blocksList[_lines[i].right_node].x + 80 &&
                e.clientY >= blocksList[_lines[i].left_node].y + 20 && e.clientY <= blocksList[_lines[i].right_node].y + 50) ||
                (e.clientX >= blocksList[_lines[i].right_node].x + 20 && e.clientX <= blocksList[_lines[i].left_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].right_node].y + 20 && e.clientY <= blocksList[_lines[i].left_node].y + 50) ||
                (e.clientX >= blocksList[_lines[i].left_node].x + 20 && e.clientX <= blocksList[_lines[i].right_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].right_node].y + 20 && e.clientY <= blocksList[_lines[i].left_node].y + 50) ||
                (e.clientX >= blocksList[_lines[i].right_node].x + 20 && e.clientX <= blocksList[_lines[i].left_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].left_node].y + 20 && e.clientY <= blocksList[_lines[i].right_node].y + 50)) {
                _lines[i].col = "red";
                lineHoverID = i;
            }
            else {
                _lines[i].col = _lines[i].colOriginal;
                lineHoverID = null;
            }
        }
        for (let i = 0; i < _lines.length; i++) {
            if (_lines[i].col == "red")
                lineHoverID = i;
        }
    }
    let selectStartX;
    let selectStartY;
    let selectWidth;
    let selectHeight;
    let selectStart = false;
    function selectBegin(e) {
        const clickedElement = e.target;
        if (clickedElement.tagName != 'CANVAS' || e.button != 0)
            return;
        selectStart = true;
        const select = document.createElement("div");
        select.classList.add("select");
        select.setAttribute("id", "select");
        workspace.appendChild(select);
        selectStartX = e.clientX - workspaceMove.translateX;
        selectStartY = e.clientY - workspaceMove.translateY;
        select.style.top = selectStartY + "px";
        select.style.left = selectStartX + "px";
    }
    function selectResize(e) {
        const select = document.getElementById("select");
        const clientX = e.clientX - workspaceMove.translateX;
        const clientY = e.clientY - workspaceMove.translateY;
        selectWidth = clientX - selectStartX;
        selectHeight = clientY - selectStartY;
        select.style.height = Math.abs(selectHeight) + "px";
        select.style.width = Math.abs(selectWidth) + "px";
        if (selectWidth < 0) {
            select.style.left = clientX + "px";
        }
        if (selectHeight < 0) {
            select.style.top = clientY + "px";
        }
    }
    function selectEnd(e) {
        const select = document.getElementById("select");
        workspace.removeChild(select);
        selectStart = false;
        blocksList.forEach((block) => {
            let inSelectY = false;
            let inSelectX = false;
            if (selectWidth >= 0) {
                if (block.x > selectStartX && block.x < selectStartX + selectWidth) {
                    inSelectX = true;
                }
            }
            else {
                if (block.x < selectStartX && block.x > selectStartX + selectWidth) {
                    inSelectX = true;
                }
            }
            if (selectHeight >= 0) {
                if (block.y > selectStartY && block.y < selectStartY + selectHeight) {
                    inSelectY = true;
                }
            }
            else {
                if (block.y < selectStartY && block.y > selectStartY + selectHeight) {
                    inSelectY = true;
                }
            }
            if ((selectStartX > block.x && selectStartX < block.x + block.div.offsetWidth) || (selectStartX + selectWidth > block.x && selectStartX + selectWidth < block.x + block.div.offsetWidth)) {
                inSelectX = true;
            }
            if ((selectStartY > block.y && selectStartY < block.y + block.div.offsetHeight) || (selectStartY + selectHeight > block.y && selectStartY + selectHeight < block.y + block.div.offsetHeight)) {
                inSelectY = true;
            }
            if (inSelectX == true && inSelectY == true) {
                block.setSelected();
            }
        });
        selectStartX = null;
        selectStartY = null;
        selectWidth = null;
        selectHeight = null;
    }
    function unselectAllBlocks() {
        blocksList.forEach((block) => {
            if (block.isSelected()) {
                block.unsetSelected();
            }
        });
    }
    window.addEventListener("resize", () => {
        _canvas.width = document.body.clientWidth;
        _canvas.height = document.body.clientHeight;
        lineController.redrawLines();
    });
});
