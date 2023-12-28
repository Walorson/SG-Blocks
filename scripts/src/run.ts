let runSpeed: number = 500; //in miliseconds
let runStatus: boolean = false;
let autorun: boolean = buttons.autorun.checked;

function run(): void
{
    if(runStatus == false)
    {
        globalVariablesUpdate();
        blocksList.forEach((block: Block) => { block.unsetActive(); });

        runStatus = true;
        executeHistory = [];
        buttons.run.textContent = "Stop Run";
        buttons.run.style.backgroundColor = "#6eadcd";

        blocksList[0].execute();
        console.log("");
        console.warn("START");
    }
    else endRun();
}

function endRun(): void
{
    runStatus = false;
    buttons.run.textContent = "Run";
    buttons.run.style.backgroundColor = '';
}

window.addEventListener("keypress", (e: KeyboardEvent) => {
    if(runStatus == false && e.key == " ") run();
});