let deleteLineMode: boolean = false;
let executeHistory: Block[] = [];
let globalVariables: Map<string, any> = new Map();
let isInputFocus: boolean = false;
const theme: HTMLElement = document.getElementById("theme");

new StartBlock(0, 0);
new OutputBlock(-50, 300, "Hello!");
new EndBlock(0, 550);

moveWorkspaceTo(blocksList[1]);
changeBlocksCategory("basic");

function globalVariablesUpdate(): void
{
    globalVariables.clear();
    for(let i=0; i<blocksList.length; i++)
    {
        if(blocksList[i] instanceof InputBlock || blocksList[i] instanceof OperationBlock || blocksList[i] instanceof RandomBlock)
        {
            globalVariables.set(blocksList[i].variableName, null);
        }
        else if(blocksList[i] instanceof VariableBlock)
        {
            globalVariables.set(blocksList[i].variableName, blocksList[i].variableValue);
        }
    }
}

function createSelectVariables(id: string = "property0", exclude: any = undefined, isClass: boolean = false): string
{
    globalVariablesUpdate();

    let select: string;

    if(isClass == true) 
        select = `<select class='${id}' style="width:83px;"><option>---</option>`;
    else 
        select = `<select id='${id}'><option>---</option>`;

    globalVariables.forEach((variable: any, key: string) => {
        if(!(exclude != undefined && exclude == key))
            select += `<option>${key}</option>`;
    });
    select += "</select>";

    return select;
}

function fakeCursorToRealCursor(e: MouseEvent): void
{
    const cursor: HTMLElement = document.getElementById("cursor");
    cursor.style.top = e.clientY+"px";
    cursor.style.left = e.clientX+"px";
}

function reverseDirection(direction: string): string {
    switch(direction) {
        case "n": return "s";
        case "s": return "n";
        case "e": return "w";
        case "w": return "e";
        default: return undefined;
    }
}

function newDirection(angle: number): string
{
    let direction: string;

    if(angle > 20 && angle < 160) 
    {
        direction = 'n';
    }
    else if(angle >= 160 && angle <= 200)
    {
        direction = 'e';
    }
    else if(angle > 200 && angle < 340)
    {
        direction = 's';
    }
    else
    {
        direction = 'w';
    }

    return direction;
}

function sanitizeOperation(operation: string): string {
    let allowed_operations = "+-*/()%&|";
    let prevOperation = -1;
    let buffer: string[] = []

    operation = operation.replace(/ /g, "");

    for (let i = 0; i < operation.length; i++) {
        let char = operation.charAt(i);
        if (allowed_operations.includes(char)) {
            buffer.push(operation.substring(prevOperation+1, i));
            buffer.push(char);
            prevOperation = i;
        }
    }

    buffer.push(operation.substring(prevOperation+1, operation.length));

    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i].search(/[a-zA-Z\[\]]/g) > -1) {
            if (!buffer[i].startsWith("{")) {
                buffer[i] = "{" + buffer[i];
            }

            if (!buffer[i].endsWith("}")) {
                buffer[i] = buffer[i] + "}";
            }
        }
    }

    let output = buffer.join("");

    return output;
}

function replaceVariablesToValues(message: string): string
{
    let readVariableMode: boolean = false;
    const variables: string[] = [];
    const variablesPosition: number[] = [];
    let variable: string = "";

    for(let i=0; i<message.length; i++)
    {
        if(message[i] == "}")
        {
            readVariableMode = false;
            variables.push(variable);
            variable = "";
        }

        if(readVariableMode == true)
        {
            variable += message[i];
        }

        if(message[i] == "{")
        {
            readVariableMode = true;
            variablesPosition.push(i);
        }
    }

    if(variables.length <= 0) return message;

    let newMessage: string = "";
    let startPos: number = 0;

    for(let i=0; i<variables.length; i++)
    {
        newMessage += message.slice(startPos, variablesPosition[i]);
        newMessage += globalVariables.get(variables[i]);
        startPos = variablesPosition[i] + variables[i].length + 2;
    }

    newMessage += message.slice(startPos, message.length);

    return newMessage;
}

function boldVariables(message: string): string
{
    const variablesPositionStart: number[] = [];
    const variablesPositionEnd: number[] = [];

    for(let i=0; i<message.length; i++)
    {
        if(message[i] == "{")
        {
            variablesPositionStart.push(i);
        }

        if(message[i] == "}")
        {
            variablesPositionEnd.push(i);
        }
    }

    if(variablesPositionStart.length <= 0 || variablesPositionStart.length != variablesPositionEnd.length) return message;

    let newMessage = "";
    let startPos = 0;

    for(let i=0; i<variablesPositionStart.length; i++)
    {
        newMessage += message.slice(startPos, variablesPositionStart[i]);
        newMessage += "<b>"+message.slice(variablesPositionStart[i] + 1, variablesPositionEnd[i])+"</b>";
        startPos = variablesPositionEnd[i] + 1;
    }

    newMessage += message.slice(startPos, message.length);

    return newMessage;
}
