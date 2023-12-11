class EndBlock extends Block 
{
    constructor(x: number, y: number) 
    {
        super(x, y);
        this.init();
    }

    createBlock(): void 
    {
        workspace.innerHTML += `<div class="block end" id="${this.id}">End</div>`;
    }

    execute(): void 
    {
        console.warn("END");
        endRun();
    }   
}