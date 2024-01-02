const blocksToCopy = [];
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "c" && isInputFocus == false) {
        copySelectedBlock();
    }
});
function copySelectedBlock() {
    blocksToCopy.length = 0;
    blocksList.forEach((block) => {
        if (block.isSelected() && !(block instanceof StartBlock))
            blocksToCopy.push(block);
    });
}
