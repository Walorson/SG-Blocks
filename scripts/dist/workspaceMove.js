const workspaceMove = {
    x: 0,
    y: 0,
    xEnd: 0,
    yEnd: 0,
    translateX: 0,
    translateY: 0,
    isMove: false,
    center: document.getElementById("center"),
    cursor: document.getElementById("workspace-cursor")
};
window.addEventListener("mousedown", (e) => {
    if (e.button != 1 || select.start == true)
        return;
    workspaceMove.isMove = true;
    workspaceMove.x = e.clientX;
    workspaceMove.y = e.clientY;
});
window.addEventListener("mousemove", (e) => {
    if (workspaceMove.isMove == false)
        return;
    workspaceMove.xEnd = e.clientX - workspaceMove.x;
    workspaceMove.yEnd = e.clientY - workspaceMove.y;
    workspace.style.transform = `translate(${workspaceMove.translateX + workspaceMove.xEnd}px, ${workspaceMove.translateY + workspaceMove.yEnd}px) scale(${workspaceResize.size})`;
    document.body.style.backgroundPosition = `${workspaceMove.translateX + workspaceMove.xEnd}px ${workspaceMove.translateY + workspaceMove.yEnd}px`;
});
window.addEventListener("mouseup", () => {
    if (workspaceMove.isMove == true) {
        workspaceMove.isMove = false;
        workspaceMove.translateX += workspaceMove.xEnd;
        workspaceMove.translateY += workspaceMove.yEnd;
    }
});
const coords = document.getElementById("coords");
let cursorX;
let cursorY;
_canvas.addEventListener("mousemove", (e) => {
    cursorX = e.offsetX - workspaceMove.translateX;
    cursorY = e.offsetY - workspaceMove.translateY;
    DEFAULT_BLOCK_X = cursorX + 20;
    DEFAULT_BLOCK_Y = cursorY;
    if (workspaceMove.isMove == false)
        displayCoords();
});
function displayCoords() {
    coords.innerHTML = `X: ${Math.floor(cursorX)}, Y: ${Math.floor(cursorY)}`;
}
function moveWorkspaceTo(block) {
    workspaceMove.translateX = -block.x + 700;
    workspaceMove.translateY = -block.y + 400;
    workspace.style.transform = `translate(${workspaceMove.translateX}px, ${workspaceMove.translateY}px) scale(${workspaceResize.size})`;
    document.body.style.backgroundPosition = `${workspaceMove.translateX}px ${workspaceMove.translateY}px`;
    lineController.redrawLines();
}
