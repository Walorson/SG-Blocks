let restoredBlocksList: Block[][] = [];

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "y" && isInputFocus == false)
    {
        redo();
    }
});

function redo(): void {
    if(undoRedoStep >= maxRedoStep) return;

    saveBlockState("undo", false);
    restoreBlocks("redo");
}