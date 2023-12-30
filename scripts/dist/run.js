let runSpeed = 500; //in miliseconds
let runStatus = false;
let autorun = buttons.autorun.checked;
function run() {
    if (runStatus == false) {
        globalVariablesUpdate();
        blocksList.forEach((block) => { block.unsetActive(); });
        runStatus = true;
        executeHistory = [];
        buttons.run.textContent = "Stop Run";
        buttons.run.style.backgroundColor = "#6eadcd";
        blocksList[0].execute();
        console.log("");
        console.warn("START");
    }
    else
        endRun();
}
function endRun() {
    runStatus = false;
    buttons.run.textContent = "Run";
    buttons.run.style.backgroundColor = '';
    blocksList.forEach((block) => {
        window.removeEventListener("keypress", block.executeOnSpacePress);
    });
}
window.addEventListener("keypress", (e) => {
    if (runStatus == false && e.key == " " && isInputFocus == false) {
        window.focus();
        run();
    }
});
