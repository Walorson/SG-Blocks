let lastBlocksList = [];
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "z" && isInputFocus == false) {
        restoreBlocks();
    }
});
function restoreBlocks() {
    if (lastBlocksList.length <= 0)
        return;
    let last = lastBlocksList.length - 1;
    blocksList.forEach((block) => {
        block.deleteBlock(true, false, true);
    });
    blocksList = [];
    lastBlocksList[last].forEach((block, index) => {
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
    delete lastBlocksList[last];
    lastBlocksList = lastBlocksList.filter((state) => state != undefined);
}
function saveBlockState() {
    const blockState = [];
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
    lastBlocksList.push(blockState);
}
//Pozdrawiam użytkownika S0FAiT4PCZ4N
