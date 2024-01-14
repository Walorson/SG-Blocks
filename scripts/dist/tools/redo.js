let restoredBlocksList = [];
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "y" && isInputFocus == false) {
        redo();
    }
});
function redo() {
    saveBlockState("undo");
    restoreBlocks("redo");
}
