const blocksToCopy = [];
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "c") {
        blocksList.forEach((block) => {
            if (block.isSelected())
                blocksToCopy.push(block);
        });
    }
});
