const workspaceMove = {
    x: 0 as number,
    y: 0 as number,
    xEnd: 0 as number,
    yEnd: 0 as number,
    translateX: 0 as number,
    translateY: 0 as number,
    isMove: false as boolean
}

window.addEventListener("mousedown", (e: MouseEvent) => {
    if(e.button != 1) return;

    workspaceMove.isMove = true;

    workspaceMove.x = e.clientX;
    workspaceMove.y = e.clientY;
});

window.addEventListener("mousemove", (e: MouseEvent) => {
    if(workspaceMove.isMove == false) return;

    workspaceMove.xEnd = e.clientX - workspaceMove.x;
    workspaceMove.yEnd = e.clientY - workspaceMove.y;
    
    workspace.style.transform = `translate(${workspaceMove.translateX + workspaceMove.xEnd}px, ${workspaceMove.translateY + workspaceMove.yEnd}px) scale(${workspaceResize.size})`;
});

window.addEventListener("mouseup", () => {
   if(workspaceMove.isMove == true)
   {
        workspaceMove.isMove = false;

        workspaceMove.translateX += workspaceMove.xEnd;
        workspaceMove.translateY += workspaceMove.yEnd;
   }
});