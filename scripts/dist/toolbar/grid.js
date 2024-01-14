const grid = {
    snap: false
};
const gridButtons = {
    display: document.getElementById("toolbar-display-grid"),
    snap: document.getElementById("toolbar-grid-snap")
};
gridButtons.display.onclick = () => {
    if (gridButtons.display.checked == true) {
        document.body.style.background = 'url("./img/grid.png")';
    }
    else {
        document.body.style.background = 'white';
    }
};
gridButtons.snap.onclick = () => {
    if (gridButtons.snap.checked == true) {
        grid.snap = true;
    }
    else {
        grid.snap = false;
    }
};
