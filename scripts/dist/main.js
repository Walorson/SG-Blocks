const RUN_SPEED = 500; //in miliseconds
let deleteLineMode = false;
let executeHistory = [];
let globalVariables = new Map();
new StartBlock(700, 50);
new OutputBlock(700, 350, "Siema");
new EndBlock(700, 600);
function run() {
    executeHistory = [];
    blocksList[0].execute();
    return "START";
}
function globalVariablesUpdate() {
    globalVariables.clear();
    for (let i = 0; i < blocksList.length; i++) {
        if (blocksList[i] instanceof InputBlock) {
            globalVariables.set(blocksList[i].variableName, null);
        }
    }
}
function createSelectVariables(id = "property0") {
    let select = `<select id='${id}'><option>---</option>`;
    globalVariables.forEach((variable, key) => {
        select += `<option>${key}</option>`;
    });
    select += "</select>";
    return select;
}
