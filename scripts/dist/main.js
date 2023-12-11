let runSpeed = 500; //in miliseconds
let runStatus = false;
let deleteLineMode = false;
let executeHistory = [];
let globalVariables = new Map();
new StartBlock(700, 50);
new OutputBlock(650, 350, "Hello!");
new EndBlock(700, 600);
function run() {
    if (runStatus == true)
        return;
    globalVariablesUpdate();
    runStatus = true;
    executeHistory = [];
    buttons.run.setAttribute("disabled", ";");
    blocksList[0].execute();
    console.log("");
    console.warn("START");
}
function globalVariablesUpdate() {
    globalVariables.clear();
    for (let i = 0; i < blocksList.length; i++) {
        if (blocksList[i] instanceof InputBlock || blocksList[i] instanceof OperationBlock) {
            globalVariables.set(blocksList[i].variableName, null);
        }
    }
}
function createSelectVariables(id = "property0", exclude = undefined) {
    let select = `<select id='${id}'><option>---</option>`;
    globalVariables.forEach((variable, key) => {
        if (!(exclude != undefined && exclude == key))
            select += `<option>${key}</option>`;
    });
    select += "</select>";
    return select;
}
function fakeCursorToRealCursor(e) {
    const cursor = document.getElementById("cursor");
    cursor.style.top = e.clientY + "px";
    cursor.style.left = e.clientX + "px";
}
function endRun() {
    runStatus = false;
    buttons.run.removeAttribute("disabled");
}
