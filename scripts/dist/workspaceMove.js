const workspaceMove = {
    x: 0,
    y: 0,
    xEnd: 0,
    yEnd: 0,
    translateX: 0,
    translateY: 0,
    isMove: false
};
window.addEventListener("mousedown", (e) => {
    if (e.button != 1)
        return;
    workspaceMove.isMove = true;
    workspaceMove.x = e.clientX;
    workspaceMove.y = e.clientY;
    console.log(workspaceMove.x, workspaceMove.y);
});
window.addEventListener("mousemove", (e) => {
    if (workspaceMove.isMove == false)
        return;
    workspaceMove.xEnd = -(e.clientX - workspaceMove.x);
    workspaceMove.yEnd = -(e.clientY - workspaceMove.y);
    workspace.style.transform = `translate(${workspaceMove.translateX + workspaceMove.xEnd}px, ${workspaceMove.translateY + workspaceMove.yEnd}px)`;
});
window.addEventListener("mouseup", () => {
    if (workspaceMove.isMove == true) {
        workspaceMove.isMove = false;
        workspaceMove.translateX += workspaceMove.xEnd;
        workspaceMove.translateY += workspaceMove.yEnd;
    }
});
