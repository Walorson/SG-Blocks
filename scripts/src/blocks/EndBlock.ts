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
        this.setActive();
        console.warn("END");
        endRun();
    }   

    properties(): void {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = '';
        });
    }
}