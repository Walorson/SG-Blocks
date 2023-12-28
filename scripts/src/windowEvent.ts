let removeLine: any;
let keyPressed: string = null;

window.addEventListener("load", () => {
    let lineHoverID: number = null;
    let shiftPressed: boolean = false;
    window.scrollTo(0,0);

    window.addEventListener("mousedown", (e: MouseEvent) => 
    {
        const elementClicked = e.target as HTMLElement;

        if(elementClicked.classList.contains("selected") == false && shiftPressed == false && e.button != 1) unselectAllBlocks();
        if(elementClicked.classList.contains("block") && e.button == 0) elementClicked.classList.add("selected");

        connectBegin(e);
        selectBegin(e);
        removeLine(lineHoverID);
    });

    window.addEventListener("mouseup", (e: MouseEvent) => 
    {
        if(select.start == true) selectEnd(e);
        connectEnd(e);
    });

    window.addEventListener("mousemove", (e: MouseEvent) => 
    {
        fakeCursorToRealCursor(e);
        if(select.start == true) selectResize(e);

        if(deleteLineMode == true) showDeletePossibilities(e);
        else document.body.style.cursor = "default";

        lineController.redrawLines();
    });

    window.addEventListener("contextmenu", (e: MouseEvent) => 
    {
        e.preventDefault();
    });

    window.addEventListener("keydown",(e: KeyboardEvent) => 
    {
        if(e.ctrlKey) {
            deleteLineMode = true;
            _canvas.style.cursor = "crosshair";
        }
        keyPressed = e.key.toUpperCase();

        if(e.shiftKey) shiftPressed = true;
        else shiftPressed = false;
    });

    window.addEventListener("keyup", (e: KeyboardEvent) => 
    {
        deleteLineMode = false;
        shiftPressed = false;
        
        for(let i=0; i<_lines.length; i++)
        {
            _lines[i].col = _lines[i].colOriginal;
        }
        _canvas.style.cursor = "default";
        document.querySelectorAll(".block").forEach((block: HTMLElement) => {
            block.style.cursor = "";
            block.style.border = "";
        });
        lineController.redrawLines();

        keyPressed = null;
    });

    removeLine = (id: number) =>
    {
        if(id == null || deleteLineMode == false) return;

        const left_node: Block = blocksList[_lines[id].left_node];
        const right_node: Block = blocksList[_lines[id].right_node]

        const leftPos: number = left_node.connectTo.indexOf(right_node);
        const rightPos: number = right_node.connectTo.indexOf(left_node);

        delete left_node.connectTo[leftPos];
        delete right_node.connectTo[rightPos];

        if(_lines[id].colOriginal == 'green') blocksList[_lines[id].left_node].connectToTRUE = undefined;
        else if(_lines[id].colOriginal == 'orange') blocksList[_lines[id].left_node].connectToFALSE = undefined;

        delete _lines[id];
        _lines = _lines.filter(item => item != undefined);

        left_node.connectTo = left_node.connectTo.filter((item: Block) => item != undefined);
        right_node.connectTo = right_node.connectTo.filter((item: Block) => item != undefined);
        

        _ctx.clearRect(0, 0,  10000, 4300);
        lineController.redrawLines();
    }

    

    function showDeletePossibilities(e: MouseEvent)
    {
            const id = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");
            if(isNaN(Number(id)) == false)
            {
                for(let i=0; i<_lines.length; i++) 
                {
                    _lines[i].col = _lines[i].colOriginal;
                }

                lineHoverID = null;
                lineController.redrawLines();
                return;
            }

            for(let i=0; i<_lines.length; i++) 
            { 

                if((e.clientX >= blocksList[_lines[i].left_node].x + 20 && e.clientX <= blocksList[_lines[i].right_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].left_node].y + 20 && e.clientY <= blocksList[_lines[i].right_node].y + 50) ||
                    (e.clientX >= blocksList[_lines[i].right_node].x + 20 && e.clientX <= blocksList[_lines[i].left_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].right_node].y + 20 && e.clientY <= blocksList[_lines[i].left_node].y + 50) ||
                    (e.clientX >= blocksList[_lines[i].left_node].x + 20 && e.clientX <= blocksList[_lines[i].right_node].x + 80 &&
                    e.clientY >= blocksList[_lines[i].right_node].y + 20 && e.clientY <= blocksList[_lines[i].left_node].y + 50)||
                    (e.clientX >= blocksList[_lines[i].right_node].x + 20 && e.clientX <= blocksList[_lines[i].left_node].x + 80 &&
                        e.clientY >= blocksList[_lines[i].left_node].y + 20 && e.clientY <= blocksList[_lines[i].right_node].y + 50)
                    ) 
                {
                    _lines[i].col = "red";
                    lineHoverID = i;
                }
                else 
                {
                    _lines[i].col = _lines[i].colOriginal;
                    lineHoverID = null;
                }
            }

            for(let i=0; i<_lines.length; i++) 
            {
                if(_lines[i].col == "red") lineHoverID = i;
            }
        
    }

    

    window.addEventListener("resize", () => {
        _canvas.width = document.body.clientWidth;
        _canvas.height = document.body.clientHeight;
        lineController.redrawLines();
    });
});