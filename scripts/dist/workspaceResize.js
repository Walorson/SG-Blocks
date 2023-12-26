const workspaceResize = {
    size: 1,
    step: 0.05,
    minSize: 0.5,
    maxSize: 2
};
/*window.addEventListener("mousewheel", (e: WheelEvent) => {
    if(e.deltaY > 0 && workspaceResize.size > workspaceResize.minSize) {
        workspaceResize.size -= workspaceResize.step;
        
    }
    else if(e.deltaY < 0 && workspaceResize.size < workspaceResize.maxSize) {
        workspaceResize.size += workspaceResize.step;
    }

    workspace.style.transform = `translate(${workspaceMove.translateX}px, ${workspaceMove.translateY}px) scale(${workspaceResize.size})`;
});*/ 
