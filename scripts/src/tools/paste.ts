window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "v" && isInputFocus == false) 
    {
        pasteBlocks();
    }
});

function pasteBlocks()
{
    if(blocksToCopy == '') return;
    copyMode = true;
    
    unselectAllBlocks();

    let len = blocksList.length;
    JSONtoBlocks(blocksToCopy);

    copyMode = false;

    for(let i=blocksList.length-1; i>=len; i--)
    {
        blocksList[i].id = i;
        blocksList[i].connectTo = [];

        if(blocksList[i] instanceof ConditionBlock)
        {
            blocksList[i].connectToFALSE = undefined;
            blocksList[i].connectToTRUE = undefined;
        }
    }

    blocksList.forEach((block: Block) => {
        if(block != undefined)
            block.update();
    });

    for(let i=blocksList.length-1; i>=len; i--)
    {
        blocksList[i].move(blocksList[i].x, blocksList[i].y - 60);
        blocksList[i].setSelected();
    }
}