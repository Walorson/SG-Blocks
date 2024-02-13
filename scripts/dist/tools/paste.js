window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "v" && isInputFocus == false) {
        pasteBlocks();
    }
});
function pasteBlocks() {
    unselectAllBlocks();
    let len = blocksList.length - JSON.parse(blocksToCopy).length;
    JSONtoBlocks(blocksToCopy);
    for (let i = blocksList.length - 1; i > len; i--) {
        blocksList[i].id = i;
        blocksList[i].connectTo = [];
    }
    blocksList.forEach((block) => {
        if (block != undefined)
            block.update();
    });
    for (let i = blocksList.length - 1; i > len; i--) {
        blocksList[i].move(blocksList[i].x, blocksList[i].y - 60);
        blocksList[i].setSelected();
    }
}
