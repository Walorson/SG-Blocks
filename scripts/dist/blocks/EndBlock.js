class EndBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block end" id="${this.id}">End</div>`;
    }
    execute() {
        this.setActive();
        console.log("%cEND", "font-weight:bolder;");
        endRun();
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = '';
        });
    }
}
