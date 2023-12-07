class StartBlock extends Block {
    constructor(x: number, y: number) {
        super(x, y);
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
}