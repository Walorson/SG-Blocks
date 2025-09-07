class RandomBlock extends Block {
    constructor(x = 0, y = 0, min = 1, max = 100) {
        super(x, y);
        this.min = min;
        this.max = max;
        this.variableName = "a" + this.id;
        globalVariables.set(this.variableName, null);
        this.init();
    }
    execute() {
        this.setActive();
        const rand = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
        globalVariables.set(this.variableName, rand);
        this.executeNextBlock();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block random" id="${this.id}"></div>`;
    }
    updateDiv() {
        this.div.innerHTML = `Random: <b>${this.min}</b> - <b>${this.max}</b>`;
        super.updateDiv();
    }
    properties() {
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 1)
                return;
            propertiesWindow.innerHTML = `
                <p>Min: <input type="number" value="${this.min}" class="property${this.id}"></p>
                <p>Max: <input type="number" value="${this.max}" class="property${this.id}"></p>
                <p>Save to Variable: <input type="text" value="${this.variableName}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.min = Number(property[0].value);
                this.updateDiv();
            };
            property[1].oninput = () => {
                this.max = Number(property[1].value);
                this.updateDiv();
            };
            property[2].oninput = () => {
                this.variableName = property[2].value;
            };
            super.properties();
        });
    }
}
