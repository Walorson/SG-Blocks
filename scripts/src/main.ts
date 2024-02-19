let deleteLineMode: boolean = false;
let executeHistory: Block[] = [];
let globalVariables: Map<string, any> = new Map();
let isInputFocus: boolean = false;

new StartBlock(700, 100);
new OutputBlock(650, 400, "Hello!");
new EndBlock(700, 650);

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
        select = `<select class='${id}'><option>---</option>`;
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