let deleteLineMode = false;
let executeHistory = [];
let globalVariables = new Map();
let isInputFocus = false;
new StartBlock(700, 100);
new OutputBlock(650, 400, "Hello!");
new EndBlock(700, 650);
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
