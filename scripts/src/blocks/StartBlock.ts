class StartBlock extends Block {
    constructor(x: number, y: number) {
        super(x, y);
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }

    properties(): void {
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Run Speed (ms): <input type="text" value="${runSpeed}" class="property${this.id}"></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                runSpeed = property[0].value;
            }

        });
    }

    delete(): void {}  
}