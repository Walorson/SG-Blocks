const workspaceMove = {
    x: 0 as number,
    y: 0 as number,
    xEnd: 0 as number,
    yEnd: 0 as number,
    translateX: 0 as number,
    translateY: 0 as number,
    isMove: false as boolean,
    center: document.getElementById("center") as HTMLElement,
    cursor: document.getElementById("workspace-cursor") as HTMLElement
}

window.addEventListener("mousedown", (e: MouseEvent) => {
    if(e.button != 1 || select.start == true) return;

    workspaceMove.isMove = true;

    workspaceMove.x = e.clientX;
    workspaceMove.y = e.clientY;
});

window.addEventListener("mousemove", (e: MouseEvent) => {
    if(workspaceMove.isMove == false) return;

    workspaceMove.xEnd = e.clientX - workspaceMove.x;
    workspaceMove.yEnd = e.clientY - workspaceMove.y;
    
    workspace.style.transform = `translate(${workspaceMove.translateX + workspaceMove.xEnd}px, ${workspaceMove.translateY + workspaceMove.yEnd}px) scale(${workspaceResize.size})`;
    document.body.style.backgroundPosition = `${workspaceMove.translateX + workspaceMove.xEnd}px ${workspaceMove.translateY + workspaceMove.yEnd}px`;
});

window.addEventListener("mouseup", () => {
   if(workspaceMove.isMove == true)
   {
        workspaceMove.isMove = false;

        workspaceMove.translateX += workspaceMove.xEnd;
        workspaceMove.translateY += workspaceMove.yEnd;
   }
});

const coords = document.getElementById("coords");
let cursorX: number;
let cursorY: number;
_canvas.addEventListener("mousemove", (e: MouseEvent) => {
    cursorX = e.offsetX - workspaceMove.translateX;
    cursorY = e.offsetY - workspaceMove.translateY;

    DEFAULT_BLOCK_X = cursorX+20;
    DEFAULT_BLOCK_Y = cursorY;

    if(workspaceMove.isMove == false)
        displayCoords();
});

function displayCoords(): void
{
    coords.innerHTML = `X: ${Math.floor(cursorX)}, Y: ${Math.floor(cursorY)}`;
}

function moveWorkspaceTo(block: Block): void
{
    const coords: any = block.getCenter();

    workspaceMove.translateX = -coords.x + window.innerWidth / 2 - 50;
    workspaceMove.translateY = -coords.y + window.innerHeight / 2 - 100;
    
    translateWorkspace();
}

function moveWorkspace(x: number, y: number): void 
{
    workspaceMove.translateX = -x;
    workspaceMove.translateY = -y;

    translateWorkspace();
}

function translateWorkspace(): void
{
    workspace.style.transform = `translate(${workspaceMove.translateX}px, ${workspaceMove.translateY}px) scale(${workspaceResize.size})`;
    document.body.style.backgroundPosition = `${workspaceMove.translateX}px ${workspaceMove.translateY}px`;

    lineController.redrawLines();
}