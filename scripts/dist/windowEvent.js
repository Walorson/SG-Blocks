let connectStart = false;
let blockStart;
let lineController;

window.addEventListener("mousedown", (e) => {
    if (e.button != 2)
        return;
    e.preventDefault();
    const id = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");
    if (isNaN(Number(id)) == false) {
        blockStart = blocksList[id];
        connectStart = true;
    }
});


window.addEventListener("load",() => {
    lineController = connect();
});

window.addEventListener("mouseup", (e) => {
    if (connectStart == false || e.button != 2)
        return;
    const connected = document.elementFromPoint(e.clientX, e.clientY).getAttribute("id");
    if (connected != null) {
        const blockEnd = blocksList[connected];
        blockStart.connectTo.push(blockEnd);

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
window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
