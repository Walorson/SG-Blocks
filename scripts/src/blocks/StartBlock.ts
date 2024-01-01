class StartBlock extends Block {
    runSpeed: number = 500;
    isDeletable: boolean = false;
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
                <p>Run Speed (ms): <input type="number" value="${runSpeed}" class="property${this.id}"></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                this.runSpeed = property[0].value;
                runSpeed = this.runSpeed;
            }

            super.properties();
        });
    }

    delete(): void {}  
}