class EmptyBlock extends Block
{
    maxConnects: number = 2;
    constructor(x: number = 0, y: number = 0)
    {
        super(x,y);

        this.init();
    }
    createBlock(): void {
        workspace.innerHTML += `<div class="block empty" id="${this.id}"></div>`;
    }
    properties(): void {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = '';
        });
    }
}