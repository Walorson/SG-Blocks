class DelayBlock extends Block {
    constructor(x = 0, y = 0, delay = 500) {
        super(x, y);
        this.delay = delay;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block delay" id="${this.id}">Delay: <i>500ms</i></div>`;
    }
    updateDiv() {
        this.div.innerHTML = `Delay: <i>${this.delay}ms</i>`;
        super.updateDiv();
    }
    execute() {
        this.setActive();
        runSpeed = this.delay;
        this.executeNextBlock();
        runSpeed = blocksList[0].runSpeed;
    }
    properties() {
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 1)
                return;
            propertiesWindow.innerHTML = `
                <p>Delay (ms): <input type="number" value="${this.delay}" class="property${this.id}" min=0></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.delay = property[0].value;
                this.updateDiv();
            };
            super.properties();
        });
    }
}
