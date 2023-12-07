let runSpeed: number = 500; //in miliseconds
let deleteLineMode: boolean = false;
let executeHistory: Block[] = [];
let globalVariables: Map<string, any> = new Map();

new StartBlock(700, 50);
new OutputBlock(700, 350, "Siema");
new EndBlock(700, 600);

function run(): string
{
    executeHistory = [];
    blocksList[0].execute();
    return "START";
}

function globalVariablesUpdate(): void
{
    globalVariables.clear();
    for(let i=0; i<blocksList.length; i++)
    {
        if(blocksList[i] instanceof InputBlock)
        {
            globalVariables.set(blocksList[i].variableName, null);
        }
    }
}

function createSelectVariables(id: string = "property0"): string
{
    let select: string = `<select id='${id}'><option>---</option>`;
    globalVariables.forEach((variable: any, key: string) => {
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