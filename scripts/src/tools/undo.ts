let lastBlocksList: Block[][] = [];

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "z" && isInputFocus == false)
    {
        restoreBlocks();
    }
});

function restoreBlocks() {
    if(lastBlocksList.length <= 0) return;

    let last: number = lastBlocksList.length-1;

    blocksList.forEach((block: Block) => {
        block.deleteBlock(true);
    });
    blocksList = [];

    lastBlocksList[last].forEach((block: Block, index: number) => {
        if(block != undefined)
        {
            let blockToPaste: Block = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
        
            blockToPaste.id = index;
            blockToPaste.init();
        } 
    });

    delete lastBlocksList[last];
    lastBlocksList = lastBlocksList.filter((state: any) => state != undefined);
}

function saveBlockState()
{
    lastBlocksList.push([...blocksList]);
}