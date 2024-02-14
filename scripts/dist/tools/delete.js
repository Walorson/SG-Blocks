let removeLine;
let lineHoverID = null;
let deletedBlocks = [];
window.addEventListener("load", () => {
    removeLine = (id, dontSaveBlockState = false) => {
        if (id == null || deleteLineMode == false || connectStart == true)
            return;
        if (dontSaveBlockState == false)
            saveBlockState();
        const left_node = blocksList[_lines[id].left_node_id];
        const right_node = blocksList[_lines[id].right_node_id];
        const leftPos = left_node.connectTo.indexOf(right_node);
        const rightPos = right_node.connectTo.indexOf(left_node);
        delete left_node.connectTo[leftPos];
        delete right_node.connectTo[rightPos];
        if (_lines[id].colOriginal == 'green')
            blocksList[_lines[id].left_node_id].connectToTRUE = undefined;
        else if (_lines[id].colOriginal == 'orange')
            blocksList[_lines[id].left_node_id].connectToFALSE = undefined;
        delete _lines[id];
        _lines = _lines.filter(item => item != undefined);
        left_node.connectTo = left_node.connectTo.filter((item) => item != undefined);
        right_node.connectTo = right_node.connectTo.filter((item) => item != undefined);
        _ctx.clearRect(0, 0, 10000, 4300);
        lineController.redrawLines();
    };
});
function showDeletePossibilities(e) {
    const id = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");
    if (connectStart == true)
        return;
    if (isNaN(Number(id)) == false) {
        for (let i = 0; i < _lines.length; i++) {
            _lines[i].col = _lines[i].colOriginal;
        }
        lineHoverID = null;
        lineController.redrawLines();
        return;
    }
    for (let i = 0; i < _lines.length; i++) {
        if ((e.clientX - workspaceMove.translateX >= blocksList[_lines[i].left_node_id].x + 40 && e.clientX - workspaceMove.translateX <= blocksList[_lines[i].right_node_id].x + 150 &&
            e.clientY - workspaceMove.translateY >= blocksList[_lines[i].left_node_id].y + 20 && e.clientY - workspaceMove.translateY <= blocksList[_lines[i].right_node_id].y + 50) ||
            (e.clientX - workspaceMove.translateX >= blocksList[_lines[i].right_node_id].x + 40 && e.clientX - workspaceMove.translateX <= blocksList[_lines[i].left_node_id].x + 150 &&
                e.clientY - workspaceMove.translateY >= blocksList[_lines[i].right_node_id].y + 20 && e.clientY - workspaceMove.translateY <= blocksList[_lines[i].left_node_id].y + 50) ||
            (e.clientX - workspaceMove.translateX >= blocksList[_lines[i].left_node_id].x + 40 && e.clientX - workspaceMove.translateX <= blocksList[_lines[i].right_node_id].x + 150 &&
                e.clientY - workspaceMove.translateY >= blocksList[_lines[i].right_node_id].y + 20 && e.clientY - workspaceMove.translateY <= blocksList[_lines[i].left_node_id].y + 50) ||
            (e.clientX - workspaceMove.translateX >= blocksList[_lines[i].right_node_id].x + 40 && e.clientX - workspaceMove.translateX <= blocksList[_lines[i].left_node_id].x + 150 &&
                e.clientY - workspaceMove.translateY >= blocksList[_lines[i].left_node_id].y + 20 && e.clientY - workspaceMove.translateY <= blocksList[_lines[i].right_node_id].y + 50)) {
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
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && connectStart == false) {
        deleteLineMode = true;
        _canvas.style.cursor = "crosshair";
    }
    if (e.key == "Delete" && isInputFocus == false) {
        deleteSelectedBlocks();
    }
});
function deleteSelectedBlocks() {
    deleteLineMode = true;
    saveBlockState();
    blocksList.forEach((block) => {
        if (block.isSelected()) {
            block.deleteBlock(false, true, true);
        }
    });
    deleteLineMode = false;
}
function deleteAllBlocks() {
    deleteLineMode = true;
    blocksList.forEach((block) => {
        block.deleteBlock(true, false, true);
    });
    deleteLineMode = false;
    blocksList = [];
}
