let runSpeed: number = 500; //in miliseconds
let runStatus: boolean = false;
let deleteLineMode: boolean = false;
let executeHistory: Block[] = [];
let globalVariables: Map<string, any> = new Map();

new StartBlock(700, 50);
new OutputBlock(650, 350, "Hello!");
new EndBlock(700, 600);

function run(): void
{
    if(runStatus == true) return;
    globalVariablesUpdate();

    runStatus = true;
    executeHistory = [];
    buttons.run.setAttribute("disabled",";");

    blocksList[0].execute();
    console.log("");
    console.warn("START");
}

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