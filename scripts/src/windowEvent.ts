window.addEventListener("load", () => {
    let connectStart: boolean = false;
    let blockStart: Block;
    let lineController: any = connect();


    window.addEventListener("mousedown", (e: MouseEvent) => 
    {
        if(e.button != 2) return;

        e.preventDefault();
        const id = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");

        if(isNaN(Number(id)) == false && blocksList[id].connectTo.length < blocksList[id].maxConnects)
        {
            blockStart = blocksList[id];
            connectStart = true;
        }
    });

    window.addEventListener("mouseup", (e: MouseEvent) => 
    {
        if(connectStart == false || e.button != 2) return;
        
        const connected = Number(document.elementFromPoint(e.clientX, e.clientY).getAttribute("id"));

        if(isNaN(connected) == false && blocksList[connected].connectTo.length < blocksList[connected].maxConnects)
        {
            const blockEnd = blocksList[connected];
            blockStart.connectTo.push(blockEnd);
            blockEnd.connectTo.push(blockStart);

            lineController.drawLine({
        
                left_node: blockStart.id,
                right_node: blockEnd.id,
                col : "black",
                width:2,
                gtype:"C"
            
            
            })
        }
        
        connectStart = false;
    });

    window.addEventListener("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
    });

    window.addEventListener("keydown",(e: KeyboardEvent) => {
        if(e.ctrlKey) deleteLineMode = true;
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
        deleteLineMode = false;
        for(let i=0; i<_lines.length; i++)
        {
            _lines[i].col = "black";
        }
        lineController.redrawLines();
    });

    let lineHoverID: number = null;
    window.addEventListener("mousemove", (e: MouseEvent) => {
        if(deleteLineMode == true)
        {
            for(let i=0; i<_lines.length; i++) { 

                if((e.clientX >= blocksList[_lines[i].left_node].x + 20 && e.clientX <= blocksList[_lines[i].right_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].left_node].y + 20 && e.clientY <= blocksList[_lines[i].right_node].y + 50) ||
                    (e.clientX >= blocksList[_lines[i].right_node].x + 20 && e.clientX <= blocksList[_lines[i].left_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].right_node].y + 20 && e.clientY <= blocksList[_lines[i].left_node].y + 50) ||
                    (e.clientX >= blocksList[_lines[i].left_node].x + 20 && e.clientX <= blocksList[_lines[i].right_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].right_node].y + 20 && e.clientY <= blocksList[_lines[i].left_node].y + 50)||
                    (e.clientX >= blocksList[_lines[i].right_node].x + 20 && e.clientX <= blocksList[_lines[i].left_node].x + 80 &&
                        e.clientY >= blocksList[_lines[i].left_node].y + 20 && e.clientY <= blocksList[_lines[i].right_node].y + 50)
                    ) {
                    _lines[i].col = "red";
                    lineHoverID = i;
                }
                else {
                    _lines[i].col = "black";
                    lineHoverID = null;
                }
            }
        }
        for(let i=0; i<_lines.length; i++) {
            if(_lines[i].col == "red") lineHoverID = i;
        }
        lineController.redrawLines();
    });

    window.addEventListener("mousedown", (e:MouseEvent) => {
        if(lineHoverID == null || deleteLineMode == false) return;

        const left_node: Block = blocksList[_lines[lineHoverID].left_node];
        const right_node: Block = blocksList[_lines[lineHoverID].right_node]

        const leftPos: number = left_node.connectTo.indexOf(right_node);
        const rightPos: number = right_node.connectTo.indexOf(left_node);

        delete left_node.connectTo[leftPos];
        delete right_node.connectTo[rightPos];

        delete _lines[lineHoverID];
        _lines = _lines.filter(item => item != undefined);

        left_node.connectTo = left_node.connectTo.filter((item: Block) => item != undefined);
        right_node.connectTo = right_node.connectTo.filter((item: Block) => item != undefined);
        

        _ctx.clearRect(0, 0,  10000, 4300);	
    });
});