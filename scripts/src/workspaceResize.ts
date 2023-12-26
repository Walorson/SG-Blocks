const workspaceResize = {
    size: 1 as number,
    step: 0.05 as number,
    minSize: 0.5 as number,
    maxSize: 2 as number
}

/*window.addEventListener("mousewheel", (e: WheelEvent) => {
    if(e.deltaY > 0 && workspaceResize.size > workspaceResize.minSize) {
        workspaceResize.size -= workspaceResize.step;
        
    }
    else if(e.deltaY < 0 && workspaceResize.size < workspaceResize.maxSize) {
        workspaceResize.size += workspaceResize.step;
    }

    workspace.style.transform = `translate(${workspaceMove.translateX}px, ${workspaceMove.translateY}px) scale(${workspaceResize.size})`;
});*/