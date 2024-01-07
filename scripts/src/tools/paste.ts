window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "v" && isInputFocus == false) 
    {
        pasteBlocks();
    }
});

function pasteBlocks()
{
    unselectAllBlocks();

    blocksToCopy.forEach((block: Block) => 
    {
        let blockToPaste: Block = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
        blockToPaste.id = blocksList.length;
        blockToPaste.y -= 50;
        blockToPaste.connectTo = [];
        blockToPaste.init();
        blockToPaste.setSelected();
    });
}