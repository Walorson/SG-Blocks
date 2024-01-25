class EmptyBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.maxConnects = 2;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block empty" id="${this.id}"></div>`;
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = '';
        });
    }
}
