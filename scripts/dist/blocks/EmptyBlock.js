class EmptyBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.maxConnects = 2;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block empty" id="${this.id}"></div>`;
    }
}
