let keyPressed: string = null;
let shiftPressed: boolean = false;

window.addEventListener("load", () => {    
    window.scrollTo(0,0);

    window.addEventListener("mousedown", (e: MouseEvent) => 
    {
        const elementClicked = e.target as HTMLElement;
        
        if(elementClicked.tagName == 'CANVAS' && shiftPressed == false && e.button != 1) unselectAllBlocks();
        connectBegin(e);
        selectBegin(e);
        removeLine(lineHoverID);

        window.scrollTo(0,0);
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

    window.addEventListener("resize", () => {
        _canvas.width = document.body.clientWidth;
        _canvas.height = document.body.clientHeight;
        lineController.redrawLines();
    });
});