window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "v" && isInputFocus == false) {
        unselectAllBlocks();
        blocksToCopy.forEach((block) => {
            let blockToPaste = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
            blockToPaste.id = blocksList.length;
            blockToPaste.y -= 50;
            blockToPaste.connectTo = [];
            blockToPaste.init();
            blockToPaste.setSelected();
        });
    }
});