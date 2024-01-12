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
        block.deleteBlock(true, false, true);
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

    blocksList.forEach((block: Block) => {
        let realConnectTo = [];
        block.connectTo.forEach((id: any) => {
            realConnectTo.push(blocksList[id]);
        });

        block.connectTo = realConnectTo;
    });

    blocksList.forEach((blockStart: Block) => {
        if(blockStart.connectTo.length > 0) 
        {
            blockStart.connectTo.forEach((blockEnd: any) => {
                connectLine(blockStart, blockEnd, "normal", true);
            });
        }

        if(blockStart instanceof ConditionBlock)
        {
            if(blockStart.connectToTRUE != undefined)
            {
                blockStart.connectToTRUE = blocksList[blockStart.connectToTRUE];
                connectLine(blockStart, blockStart.connectToTRUE, "true", true);
            }
            if(blockStart.connectToFALSE != undefined)
            {
                blockStart.connectToFALSE = blocksList[blockStart.connectToFALSE];
                connectLine(blockStart, blockStart.connectToFALSE, "false", true);
            }
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

        if(block instanceof ConditionBlock)
        {
            if(block.connectToTRUE != undefined)
                block.connectToTRUE = block.connectToTRUE.id;
            if(block.connectToFALSE != undefined)
                block.connectToFALSE = block.connectToFALSE.id;
        }

        block.connectTo = connectToMap;
        blockState.push(block);
    }

    lastBlocksList.push(blockState);
}

//Pozdrawiam użytkownika S0FAiT4PCZ4N