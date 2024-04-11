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
    const copiedBlocksCount = Math.abs(len - blocksList.length);

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

    blocksList.forEach((block: Block) => {
        if(block != undefined)
            block.updateDiv();
    });

    let avg = {
        x: 0 as number,
        y: 0 as number
    }

    for(let i=blocksList.length-1; i>=len; i--)
    {
        avg.x += blocksList[i].x;
        avg.y += blocksList[i].y;
        blocksList[i].setSelected();
    }

    avg.x /= copiedBlocksCount;
    avg.y /= copiedBlocksCount;

    for(let i=blocksList.length-1; i>=len; i--)
    {
        let moveX = (blocksList[i].x + (cursorX - avg.x)); 
        let moveY = (blocksList[i].y + (cursorY - avg.y));

        if(copiedBlocksCount <= 1)
        {
            moveX -= blocksList[i].div.offsetWidth / 2;
            moveY -= blocksList[i].div.offsetHeight / 2;
        }
        else moveX -= 50;

        blocksList[i].move(moveX, moveY)
    }
}