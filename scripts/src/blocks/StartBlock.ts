class StartBlock extends Block {
    runSpeed: number;
    isDeletable: boolean = false;
    constructor(x: number = 0, y: number = 0, runSpeed: number = 500) {
        super(x, y);
        this.runSpeed = runSpeed;
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
        runSpeed = this.runSpeed;
    }

    properties(): void {
        this.div.addEventListener("mousedown", (e: MouseEvent) => {
            if(e.button == 1) return;
            
            propertiesWindow.innerHTML = `
                <p>Run Speed (ms): <input type="number" value="${this.runSpeed}" class="property${this.id}"></p>
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