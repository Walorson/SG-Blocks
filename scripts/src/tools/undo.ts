let lastBlocksList: Block[][] = [];

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "z" && isInputFocus == false)
    {
        undo();
    }
});

function undo(): void {
    saveBlockState("redo");
    restoreBlocks("undo");
}

function restoreBlocks(action: string = "undo"): void 
{
    if(action != "undo" && action != "redo") 
    {
        console.error("UNEXPECTED ACTION");
        return;
    }

    if(lastBlocksList.length <= 0 && action == "undo") return;
    else if(restoredBlocksList.length <= 0 && action == "redo") return;

    let last: number;
    if(action == "undo") last = lastBlocksList.length-1;
    else if(action == "redo") last = restoredBlocksList.length-1;

    blocksList.forEach((block: Block) => {
        block.deleteBlock(true, false, true);
    });
    blocksList = [];

    let list: Block[] = [];
    if(action == "undo") list = lastBlocksList[last];
    else if(action == "redo") list = restoredBlocksList[last];

    list.forEach((block: Block, index: number) => {
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

    if(action == "undo")
    {
        delete lastBlocksList[last];
        lastBlocksList = lastBlocksList.filter((state: any) => state != undefined);
    }
    else if(action == "redo")
    {
        delete restoredBlocksList[last];
        restoredBlocksList = restoredBlocksList.filter((state: any) => state != undefined);
    }
}

function saveBlockState(action: string = "undo"): void
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

    if(action == "undo")
        lastBlocksList.push(blockState);
    else if(action == "redo")
        restoredBlocksList.push(blockState);
}

//Pozdrawiam użytkownika S0FAiT4PCZ4N