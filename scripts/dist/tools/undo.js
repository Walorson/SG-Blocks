let lastBlocksList = [];
let undoRedoStep = 0;
let maxRedoStep = 0;
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "z" && isInputFocus == false) {
        undo();
    }
});
function undo() {
    if (undoRedoStep <= 0)
        return;
    saveBlockState("redo", false);
    restoreBlocks("undo");
    undoRedoStep -= 2;
}
function restoreBlocks(action = "undo") {
    if (action != "undo" && action != "redo") {
        console.error("UNEXPECTED ACTION");
        return;
    }
    if (lastBlocksList.length <= 0 && action == "undo")
        return;
    else if (restoredBlocksList.length <= 0 && action == "redo")
        return;
    let last;
    if (action == "undo")
        last = lastBlocksList.length - 1;
    else if (action == "redo")
        last = restoredBlocksList.length - 1;
    deleteAllBlocks();
    let list = [];
    if (action == "undo")
        list = lastBlocksList[last];
    else if (action == "redo")
        list = restoredBlocksList[last];
    list.forEach((block, index) => {
        if (block != undefined) {
            let blockToPaste = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
            blockToPaste.id = index;
            blockToPaste.init();
        }
        else {
            blocksList.push(undefined);
            delete blocksList[index];
        }
    });
    if (action == "undo") {
        delete lastBlocksList[last];
        lastBlocksList = lastBlocksList.filter((state) => state != undefined);
    }
    else if (action == "redo") {
        delete restoredBlocksList[last];
        restoredBlocksList = restoredBlocksList.filter((state) => state != undefined);
    }
}
function saveBlockState(action = "undo", changeLog = true) {
    const blockState = convertConnectToToMap();
    if (action == "undo")
        lastBlocksList.push(blockState);
    else if (action == "redo")
        restoredBlocksList.push(blockState);
    undoRedoStep++;
    if (changeLog == true)
        maxRedoStep = undoRedoStep;
}
function convertConnectToToMap() {
    let blockState = [];
    for (let i = 0; i < blocksList.length; i++) {
        if (blocksList[i] == undefined) {
            blockState.push(undefined);
            continue;
        }
        let block = Object.assign(Object.create(Object.getPrototypeOf(blocksList[i])), blocksList[i]);
        let connectToMap = [];
        block.connectTo.forEach((block) => {
            connectToMap.push(block.id);
        });
        if (block instanceof ConditionBlock) {
            if (block.connectToTRUE != undefined)
                block.connectToTRUE = block.connectToTRUE.id;
            if (block.connectToFALSE != undefined)
                block.connectToFALSE = block.connectToFALSE.id;
        }
        block.connectTo = connectToMap;
        blockState.push(block);
    }
    return blockState;
}
function convertMapToConnectTo() {
    blocksList.forEach((block) => {
        let realConnectTo = [];
        block.connectTo.forEach((id) => {
            realConnectTo.push(blocksList[id]);
        });
        block.connectTo = realConnectTo;
    });
    blocksList.forEach((blockStart) => {
        if (blockStart.connectTo.length > 0) {
            blockStart.connectTo.forEach((blockEnd) => {
                connectLine(blockStart, blockEnd, "normal", true);
            });
        }
        if (blockStart instanceof ConditionBlock) {
            if (blockStart.connectToTRUE != undefined) {
                blockStart.connectToTRUE = blocksList[blockStart.connectToTRUE];
                connectLine(blockStart, blockStart.connectToTRUE, "true", true);
            }
            if (blockStart.connectToFALSE != undefined) {
                blockStart.connectToFALSE = blocksList[blockStart.connectToFALSE];
                connectLine(blockStart, blockStart.connectToFALSE, "false", true);
            }
        }
    });
}
//Pozdrawiam użytkownika S0FAiT4PCZ4N
