class EndBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block end" id="${this.id}">End</div>`;
    }
    execute() {
        console.warn("END");
        runStatus = false;
    }
    delete() { }
}
