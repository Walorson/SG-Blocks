class StartBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.runSpeed = 500;
        this.isDeletable = false;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Run Speed (ms): <input type="number" value="${runSpeed}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.runSpeed = property[0].value;
                runSpeed = this.runSpeed;
            };
            super.properties();
        });
    }
    delete() { }
}
