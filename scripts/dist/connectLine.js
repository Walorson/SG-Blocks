let lineController = connect();
let connectStart = false;
let blockStart;
function connectBegin(e) {
    if (e.button != 2)
        return;
    e.preventDefault();
    let block = document.elementFromPoint(e.clientX, e.clientY);
    if (block.tagName == 'B' || block.tagName == 'I' || block.tagName == 'P' || block.tagName == 'SPAN') {
        block = block.parentElement;
        if (block.tagName == 'I')
            block = block.parentElement;
        if (block.tagName == 'P')
            block = block.parentElement;
        if (block.tagName == 'SPAN')
            block = block.parentElement;
    }
    let id = Number(block.getAttribute("id"));
    if (isNaN(id) == false && block.tagName == "DIV") {
        if (blocksList[id].connectTo.length < blocksList[id].maxConnects) {
            blockStart = blocksList[id];
            connectStart = true;
            if (!(blockStart instanceof ConditionBlock)) {
                connectLineSimplex(String(blockStart.id), "cursor");
            }
            else {
                if (keyPressed == 'Z') {
                    connectLineSimplex(String(blockStart.id), "cursor", "green", 3);
                }
                else if (keyPressed == 'X') {
                    connectLineSimplex(String(blockStart.id), "cursor", "orange", 3);
                }
                else {
                    connectLineSimplex(String(blockStart.id), "cursor");
                }
            }
        }
    }
}
function connectEnd(e) {
    if (connectStart == false || e.button != 2)
        return;
    delete _lines[_lines.length - 1];
    _lines = _lines.filter(line => line != undefined);
    _ctx.clearRect(0, 0, 10000, 4300);
    let block = document.elementFromPoint(e.clientX, e.clientY);
    if (block.tagName == 'B' || block.tagName == 'I' || block.tagName == 'P' || block.tagName == 'SPAN') {
        block = block.parentElement;
        if (block.tagName == 'I')
            block = block.parentElement;
        if (block.tagName == 'P')
            block = block.parentElement;
        if (block.tagName == 'SPAN')
            block = block.parentElement;
    }
    const connected = Number(block.getAttribute("id"));
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
        saveBlockState();
        if (blockStart instanceof ConditionBlock && keyPressed != null) {
            if (keyPressed == 'Z' && blockStart.connectToTRUE == undefined) {
                connectLine(blockStart, blockEnd, "true");
            }
            if (keyPressed == 'X' && blockStart.connectToFALSE == undefined) {
                connectLine(blockStart, blockEnd, "false");
            }
        }
        else {
            connectLine(blockStart, blockEnd);
        }
    }
    connectStart = false;
}
function connectLine(start, end, type = "normal", noPush = false, point = "n") {
    if (start instanceof ConditionBlock) {
        if (type == "true") {
            createLineTemplate("green", 3);
            start.connectToTRUE = end;
        }
        else if (type == "false") {
            createLineTemplate("orange", 3);
            start.connectToFALSE = end;
        }
        else {
            createLineTemplate("black", 2);
            if (noPush == false)
                start.connectTo.push(end);
        }
    }
    else {
        createLineTemplate("black", 2);
        if (noPush == false)
            start.connectTo.push(end);
    }
    start.updateConnectPoint(true);
    function createLineTemplate(color = "black", width = 2, type = 'D') {
        lineController.drawLine({
            left_node: start.id + point,
            right_node: end.id + point,
            left_node_id: start.id,
            right_node_id: end.id,
            col: color,
            colOriginal: color,
            width: width,
            gtype: type
        });
    }
}
function connectLineSimplex(startId, endId, color = "black", width = 2, type = "D") {
    lineController.drawLine({
        left_node: startId,
        right_node: endId,
        col: color,
        width: width,
        gtype: type
    });
}
