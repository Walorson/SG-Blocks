class EndBlock extends Block 
{
    constructor(x: number = 0, y: number = 0) 
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
        console.log("%cEND","font-weight:bolder;");
        endRun();
    }   

    properties(): void {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = '';
        });
    }
}