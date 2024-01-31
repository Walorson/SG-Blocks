class TextBlock extends Block
{
    text: string = "text";
    maxConnects: number = 0;
    constructor(x: number = 0, y: number = 0)
    {
        super(x,y);

        this.init();
    }

    createBlock(): void 
    {
        workspace.innerHTML += `<div class="block text" id="${this.id}">Sample Text</div>`;
    }

    updateDiv(): void {
        this.div.innerHTML = `<span>${this.text}</span>`;
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Message: <input type="text" value="${this.text}" class="property${this.id}"></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);

            property[0].oninput = () => {
                this.text = property[0].value;
                this.updateDiv();
            };  

            super.properties();
        });
    }
}