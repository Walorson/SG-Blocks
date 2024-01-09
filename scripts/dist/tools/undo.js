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
        block.deleteBlock(true);
    });
    blocksList = [];
    lastBlocksList[last].forEach((block, index) => {
        if (block != undefined) {
            let blockToPaste = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
            blockToPaste.id = index;
            blockToPaste.init();
        }
    });
    delete lastBlocksList[last];
    lastBlocksList = lastBlocksList.filter((state) => state != undefined);
}
function saveBlockState() {
    lastBlocksList.push([...blocksList]);
}
