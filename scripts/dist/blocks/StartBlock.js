class StartBlock extends Block {
    constructor(x = 0, y = 0, runSpeed = 500) {
        super(x, y);
        this.isDeletable = false;
        this.runSpeed = runSpeed;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
        runSpeed = this.runSpeed;
    }
    properties() {
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 1)
                return;
            propertiesWindow.innerHTML = `
                <p>Run Speed (ms): <input type="number" value="${this.runSpeed}" class="property${this.id}"></p>
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
