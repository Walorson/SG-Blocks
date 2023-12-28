let deleteLineMode: boolean = false;
let executeHistory: Block[] = [];
let globalVariables: Map<string, any> = new Map();

new StartBlock(700, 80);
new OutputBlock(650, 380, "Hello!");
new EndBlock(700, 630);

function globalVariablesUpdate(): void
{
    globalVariables.clear();
    for(let i=0; i<blocksList.length; i++)
    {
        if(blocksList[i] instanceof InputBlock || blocksList[i] instanceof OperationBlock)
        {
            globalVariables.set(blocksList[i].variableName, null);
        }
    }
}

function createSelectVariables(id: string = "property0", exclude: any = undefined): string
{
    let select: string = `<select id='${id}'><option>---</option>`;
    globalVariables.forEach((variable: any, key: string) => {
        if(!(exclude != undefined && exclude == key))
            select += `<option>${key}</option>`;
    });
    select += "</select>";

    return select;
}

function fakeCursorToRealCursor(e: MouseEvent)
{
    const cursor: HTMLElement = document.getElementById("cursor");
    cursor.style.top = e.clientY+"px";
    cursor.style.left = e.clientX+"px";
}