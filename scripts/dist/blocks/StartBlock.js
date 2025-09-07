class StartBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.runSpeed = 500;
        this.isDeletable = false;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
    properties() {
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 1)
                return;
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
