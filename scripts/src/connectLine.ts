let lineController: any = connect();
let connectStart: boolean = false;
let blockStart: Block;

function connectBegin(e: MouseEvent): void
{
    if(e.button != 2) return;

    e.preventDefault();
    let block: Element = document.elementFromPoint(e.clientX, e.clientY);

    if(block.tagName == 'B' || block.tagName == 'I' || block.tagName == 'P' || block.tagName == 'SPAN') 
    {
        block = block.parentElement;

        if(block.tagName == 'P')
            block = block.parentElement;

        if(block.tagName == 'SPAN')
            block = block.parentElement;
    }

    let id: number = Number(block.getAttribute("id"));

    if(isNaN(id) == false && block.tagName == "DIV")
    {
        if(blocksList[id].connectTo.length < blocksList[id].maxConnects)
        {
            blockStart = blocksList[id];
            connectStart = true;

            lineController.drawLine({
        
                left_node: blockStart.id,
                right_node: "cursor",
                col : "black",
                colOriginal: "black",
                width:2,
                gtype:"D"
            
            });
        }
    }

    
}

function connectEnd(e: MouseEvent)
{
    if(connectStart == false || e.button != 2) return;
    
    delete _lines[_lines.length-1];
    _lines = _lines.filter(line => line != undefined);
    _ctx.clearRect(0, 0,  10000, 4300);	

    let block: Element = document.elementFromPoint(e.clientX, e.clientY);
    if(block.tagName == 'B' || block.tagName == 'I' || block.tagName == 'P' || block.tagName == 'SPAN')
    {
        block = block.parentElement;

        if(block.tagName == 'P')
            block = block.parentElement;

        if(block.tagName == 'SPAN')
            block = block.parentElement;
         
    }

    const connected: number = Number(block.getAttribute("id"));

    if(isNaN(connected) == false && blocksList[connected].connectTo.length < blocksList[connected].maxConnects)
    {
        const blockEnd = blocksList[connected];
        if(blockEnd == blockStart) return;

        let isBlockRepeat: Boolean = false;
        blockStart.connectTo.forEach((block: Block) => {
            if(block == blockEnd) isBlockRepeat = true;
        });
        if(isBlockRepeat == true) return;

        let isDeadLoop: Boolean = false;
        blockEnd.connectTo.forEach((block: Block) => {
            if(block == blockStart) isDeadLoop = true;
        });
        if(isDeadLoop == true) return;

        saveBlockState();

        if(blockStart instanceof ConditionBlock && keyPressed != null)
        {
            if(keyPressed == 'Z' && blockStart.connectToTRUE == undefined)
            {
                connectLine(blockStart, blockEnd, "true")
            }
            if(keyPressed == 'X' && blockStart.connectToFALSE == undefined)
            {
                connectLine(blockStart, blockEnd, "false")
            }
        }
        else {
            connectLine(blockStart, blockEnd);
        }
    }

    connectStart = false;
}

function connectLine(start: Block, end: Block, type: string = "normal", noPush: boolean = false): void
{
    if(start instanceof ConditionBlock)
    {   
            if(type == "true") {
                lineController.drawLine({

                    left_node: start.id,
                    right_node: end.id,
                    col : "green",
                    colOriginal: "green",
                    width:3,
                    gtype:"D"
                
                });

                start.connectToTRUE = end;
            }
            else if(type == "false") {
                lineController.drawLine({

                    left_node: start.id,
                    right_node: end.id,
                    col : "orange",
                    colOriginal: "orange",
                    width:3,
                    gtype:"D"
                
                }); 

                start.connectToFALSE = end;
            }
            else {
                lineController.drawLine({

                    left_node: start.id,
                    right_node: end.id,
                    col : "black",
                    colOriginal: "black",
                    width:2,
                    gtype:"D"
                
                });

                if(noPush == false) start.connectTo.push(end);
            }
    }
    else {
        lineController.drawLine({

            left_node: start.id,
            right_node: end.id,
            col : "black",
            colOriginal: "black",
            width:2,
            gtype:"D"
        
        });

        if(noPush == false) start.connectTo.push(end);
    }
}