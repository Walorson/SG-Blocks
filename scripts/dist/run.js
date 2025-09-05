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
        buttons.run.classList.add("run-while-run");
        blocksList[0].execute();
        console.log("");
        console.log("%cSTART", "font-weight:bolder;");
    }
    else
        endRun();
}
function endRun() {
    runStatus = false;
    buttons.run.textContent = "Run";
    buttons.run.classList.remove("run-while-run");
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
