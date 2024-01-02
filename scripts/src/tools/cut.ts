window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "x" && isInputFocus == false)
    {
        copySelectedBlock();
        deleteSelectedBlocks();
    }
});