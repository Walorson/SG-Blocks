let removeLine;
window.addEventListener("load", () => {
    let connectStart = false;
    let blockStart;
    let lineController = connect();
    window.addEventListener("mousedown", (e) => {
        if (e.button != 2)
            return;
        e.preventDefault();
        const id = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");
        if (isNaN(Number(id)) == false && blocksList[id].connectTo.length < blocksList[id].maxConnects) {
            blockStart = blocksList[id];
            connectStart = true;
        }
    });
    window.addEventListener("mouseup", (e) => {
        if (connectStart == false || e.button != 2)
            return;
        const connected = Number(document.elementFromPoint(e.clientX, e.clientY).getAttribute("id"));
        if (isNaN(connected) == false && blocksList[connected].connectTo.length < blocksList[connected].maxConnects) {
            const blockEnd = blocksList[connected];
            blockStart.connectTo.push(blockEnd);
            blockEnd.connectTo.push(blockStart);
            if (blockEnd instanceof ConditionBlock || blockStart instanceof ConditionBlock) {
                let length;
                if (blockEnd instanceof ConditionBlock)
                    length = blockEnd.connectTo.length;
                else
                    length = blockStart.connectTo.length;
                switch (length) {
                    case 2:
                        lineController.drawLine({
                            left_node: blockStart.id,
                            right_node: blockEnd.id,
                            col: "green",
                            colOriginal: "green",
                            width: 3,
                            gtype: "C"
                        });
                        break;
                    case 3:
                        lineController.drawLine({
                            left_node: blockStart.id,
                            right_node: blockEnd.id,
                            col: "orange",
                            colOriginal: "orange",
                            width: 3,
                            gtype: "C"
                        });
                        break;
                    default:
                        lineController.drawLine({
                            left_node: blockStart.id,
                            right_node: blockEnd.id,
                            col: "black",
                            colOriginal: "black",
                            width: 2,
                            gtype: "C"
                        });
                        break;
                }
            }
            else {
                lineController.drawLine({
                    left_node: blockStart.id,
                    right_node: blockEnd.id,
                    col: "black",
                    colOriginal: "black",
                    width: 2,
                    gtype: "C"
                });
            }
        }
        connectStart = false;
    });
    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey)
            deleteLineMode = true;
    });
    window.addEventListener("keyup", (e) => {
        deleteLineMode = false;
        for (let i = 0; i < _lines.length; i++) {
            _lines[i].col = _lines[i].colOriginal;
        }
        lineController.redrawLines();
    });
    let lineHoverID = null;
    window.addEventListener("mousemove", (e) => {
        if (deleteLineMode == true) {
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
        }
        for (let i = 0; i < _lines.length; i++) {
            if (_lines[i].col == "red")
                lineHoverID = i;
        }
        lineController.redrawLines();
    });
    window.addEventListener("mousedown", (e) => {
        removeLine(lineHoverID);
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
        delete _lines[id];
        _lines = _lines.filter(item => item != undefined);
        left_node.connectTo = left_node.connectTo.filter((item) => item != undefined);
        right_node.connectTo = right_node.connectTo.filter((item) => item != undefined);
        _ctx.clearRect(0, 0, 10000, 4300);
        lineController.redrawLines();
    };
});
