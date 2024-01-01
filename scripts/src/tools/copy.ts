const blocksToCopy = [];

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "c") {
        blocksList.forEach((block: Block) => {
            if(block.isSelected()) blocksToCopy.push(block);
        });
    }
});