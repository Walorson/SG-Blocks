window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "x" && isInputFocus == false) {
        copySelectedBlock();
        deleteSelectedBlocks();
    }
});
