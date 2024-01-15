let restoredBlocksList = [];
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "y" && isInputFocus == false) {
        redo();
    }
});
function redo() {
    if (undoRedoStep >= maxRedoStep)
        return;
    saveBlockState("undo", false);
    restoreBlocks("redo");
}
