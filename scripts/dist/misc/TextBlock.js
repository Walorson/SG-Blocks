class TextBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.text = "text";
        this.maxConnects = 0;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block text" id="${this.id}">Sample Text</div>`;
    }
    updateDiv() {
        this.div.innerHTML = `<span>${this.text}</span>`;
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Message: <input type="text" value="${this.text}" class="property${this.id}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.text = property[0].value;
                this.updateDiv();
            };
            super.properties();
        });
    }
}
