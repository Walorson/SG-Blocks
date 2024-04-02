let blocksToCopy = "";
let copyMode = false;
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "c" && isInputFocus == false) {
        copySelectedBlock();
    }
});
function copySelectedBlock() {
    blocksToCopy = "";
    let blocksToCopyList = [];
    blocksList.forEach((block) => {
        if (block.isSelected() && !(block instanceof StartBlock)) {
            blocksToCopyList.push(block);
        }
    });
    blocksToCopyList = convertConnectToToMap(blocksToCopyList);
    blocksToCopy = blocksToJSON(blocksToCopyList);
}
