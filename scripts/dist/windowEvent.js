let removeLine;
window.addEventListener("load", () => {
    let connectStart = false;
    let blockStart;
    let lineHoverID = null;
    let lineController = connect();
    let keyPressed = null;
    window.addEventListener("mousedown", (e) => {
        connectBegin(e);
        removeLine(lineHoverID);
    });
    window.addEventListener("mouseup", (e) => {
        connectEnd(e);
    });
    window.addEventListener("mousemove", (e) => {
        fakeCursorToRealCursor(e);
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
    });
    window.addEventListener("keyup", (e) => {
        deleteLineMode = false;
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
    window.addEventListener("resize", () => {
        _canvas.width = document.body.clientWidth;
        _canvas.height = document.body.clientHeight;
        lineController.redrawLines();
    });
});
