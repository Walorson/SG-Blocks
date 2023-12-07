class StartBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
}
