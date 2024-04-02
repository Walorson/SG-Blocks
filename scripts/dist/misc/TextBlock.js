class TextBlock extends Block {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.text = "text";
        this.textHTML = "text";
        this.maxConnects = 0;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block text" id="${this.id}">Sample Text</div>`;
    }
    updateDiv() {
        this.div.innerHTML = `<span>${this.textHTML}</span>`;
    }
    properties() {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Message: <textarea class="property${this.id}">${this.text}</textarea></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.text = property[0].value;
                this.textHTML = this.newLineTransform(this.text);
                this.updateDiv();
            };
            super.properties();
        });
    }
    newLineTransform(text) {
        const indexArray = [];
        let index = text.indexOf("\n");
        let newText = "";
        while (index != -1) {
            indexArray.push(index);
            index = text.indexOf("\n", index + 1);
        }
        for (let i = 0; i < indexArray.length; i++) {
            if (i == 0)
                newText += text.slice(0, indexArray[i]) + "<br>";
            else
                newText += text.slice(indexArray[i - 1] + 1, indexArray[i]) + "<br>";
        }
        newText += text.slice(indexArray[indexArray.length - 1] + 1, text.length);
        if (indexArray.length > 0)
            return newText;
        else
            return text;
    }
}
