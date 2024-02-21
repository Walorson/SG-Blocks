let deleteLineMode = false;
let executeHistory = [];
let globalVariables = new Map();
let isInputFocus = false;
new StartBlock(0, 0);
new OutputBlock(-50, 300, "Hello!");
new EndBlock(0, 550);
moveWorkspaceTo(blocksList[1]);
changeBlocksCategory("basic");
function globalVariablesUpdate() {
    globalVariables.clear();
    for (let i = 0; i < blocksList.length; i++) {
        if (blocksList[i] instanceof InputBlock || blocksList[i] instanceof OperationBlock || blocksList[i] instanceof RandomBlock) {
            globalVariables.set(blocksList[i].variableName, null);
        }
        else if (blocksList[i] instanceof VariableBlock) {
            globalVariables.set(blocksList[i].variableName, blocksList[i].variableValue);
        }
    }
}
function createSelectVariables(id = "property0", exclude = undefined, isClass = false) {
    globalVariablesUpdate();
    let select;
    if (isClass == true)
        select = `<select class='${id}'><option>---</option>`;
    else
        select = `<select id='${id}'><option>---</option>`;
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
function reverseDirection(direction) {
    switch (direction) {
        case "n": return "s";
        case "s": return "n";
        case "e": return "w";
        case "w": return "e";
        default: return undefined;
    }
}
function newDirection(angle) {
    let direction;
    if (angle > 20 && angle < 160) {
        direction = 'n';
    }
    else if (angle >= 160 && angle <= 200) {
        direction = 'e';
    }
    else if (angle > 200 && angle < 340) {
        direction = 's';
    }
    else {
        direction = 'w';
    }
    return direction;
}
function replaceVariablesToValues(message) {
    let readVariableMode = false;
    const variables = [];
    const variablesPosition = [];
    let variable = "";
    for (let i = 0; i < message.length; i++) {
        if (message[i] == "}") {
            readVariableMode = false;
            variables.push(variable);
            variable = "";
        }
        if (readVariableMode == true) {
            variable += message[i];
        }
        if (message[i] == "{") {
            readVariableMode = true;
            variablesPosition.push(i);
        }
    }
    if (variables.length <= 0)
        return message;
    let newMessage = "";
    let startPos = 0;
    for (let i = 0; i < variables.length; i++) {
        newMessage += message.slice(startPos, variablesPosition[i]);
        newMessage += globalVariables.get(variables[i]);
        startPos = variablesPosition[i] + variables[i].length + 2;
    }
    newMessage += message.slice(startPos, message.length);
    return newMessage;
}
function boldVariables(message) {
    const variablesPositionStart = [];
    const variablesPositionEnd = [];
    for (let i = 0; i < message.length; i++) {
        if (message[i] == "{") {
            variablesPositionStart.push(i);
        }
        if (message[i] == "}") {
            variablesPositionEnd.push(i);
        }
    }
    if (variablesPositionStart.length <= 0 || variablesPositionStart.length != variablesPositionEnd.length)
        return message;
    let newMessage = "";
    let startPos = 0;
    for (let i = 0; i < variablesPositionStart.length; i++) {
        newMessage += message.slice(startPos, variablesPositionStart[i]);
        newMessage += "<b>" + message.slice(variablesPositionStart[i] + 1, variablesPositionEnd[i]) + "</b>";
        startPos = variablesPositionEnd[i] + 1;
    }
    newMessage += message.slice(startPos, message.length);
    return newMessage;
}
