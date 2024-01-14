const grid = {
    snap: false as boolean
}
const gridButtons = {
    display: document.getElementById("toolbar-display-grid") as HTMLInputElement,
    snap: document.getElementById("toolbar-grid-snap") as HTMLInputElement
}

gridButtons.display.onclick = () => {
    if(gridButtons.display.checked == true)
    {
        document.body.style.background = 'url("./img/grid.png")';
    }
    else {
        document.body.style.background = 'white';
    }
}

gridButtons.snap.onclick = () => {
    if(gridButtons.snap.checked == true) {
        grid.snap = true;
    }
    else {
        grid.snap = false;
    }
}