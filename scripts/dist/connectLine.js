let lineController = connect();
let connectStart = false;
let blockStart;
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
        let isDeadLoop = false;
        blockEnd.connectTo.forEach((block) => {
            if (block == blockStart)
                isDeadLoop = true;
        });
        if (isDeadLoop == true)
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
