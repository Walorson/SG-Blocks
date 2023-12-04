let connectStart: boolean = false;
let blockStart: Block;

window.addEventListener("mousedown", (e: MouseEvent) => 
{
    if(e.button != 2) return;

    e.preventDefault();
    const id = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");

    if(isNaN(Number(id)) == false)
    {
        blockStart = blocksList[id];
        connectStart = true;
    }
});

window.addEventListener("mouseup", (e: MouseEvent) => 
{
    if(connectStart == false || e.button != 2) return;
    
    const connected = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");

    if(connected != null) 
    {
        const blockEnd = blocksList[connected];
        blockStart.connectTo.push(blockEnd);
    }
    
    connectStart = false;
});

window.addEventListener("contextmenu", (e: MouseEvent) => {
    e.preventDefault();
})