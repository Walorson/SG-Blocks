let lastBlocksList: Block[][] = [];

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "z" && isInputFocus == false)
    {
        restoreBlocks();
    }
});

function restoreBlocks(): void {
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
        else {
            blocksList.push(undefined);
            delete blocksList[index];
        }
    });

    delete lastBlocksList[last];
    lastBlocksList = lastBlocksList.filter((state: any) => state != undefined);
}

function saveBlockState(): void
{
    const blockState: Block[] = [];
    for(let i=0; i<blocksList.length; i++)
    {
        if(blocksList[i] == undefined) {
            blockState.push(undefined);
            continue;
        }

        let block: Block = Object.assign(Object.create(Object.getPrototypeOf(blocksList[i])), blocksList[i]);
        let connectToMap = [];
        block.connectTo.forEach((block: Block) => {
            connectToMap.push(block.id);
        });
        block.connectTo = [...connectToMap];
        console.log(block.connectTo);
        blockState.push(block);
    }

    for(let i=0; i<blockState.length; i++)
    {
        if(blockState[i].connectTo.length <= 0 || blockState[i] == undefined) continue;

        let realConnectTo = [];
        blockState[i].connectTo.forEach((id: any) => {
            realConnectTo.push(blocksList[id]);
        });

        blockState[i].connectTo = [...realConnectTo];
    }
    
    lastBlocksList.push(blockState);
}