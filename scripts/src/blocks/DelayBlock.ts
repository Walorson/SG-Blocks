class DelayBlock extends Block {
    delay: number;
    constructor(x: number = 0, y: number = 0, delay: number = 500) {
        super(x, y);
        this.delay = delay;
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block delay" id="${this.id}">Delay: <i>500ms</i></div>`;
    }

    updateDiv(): void {
        this.div.innerHTML = `Delay: <i>${this.delay}ms</i>`;
        super.updateDiv();
    }

    execute(): void {
        this.setActive();

        runSpeed = this.delay;
        this.executeNextBlock();
        runSpeed = blocksList[0].runSpeed;
    }

    properties(): void {
        this.div.addEventListener("mousedown", (e: MouseEvent) => {
            if(e.button == 1) return;
            
            propertiesWindow.innerHTML = `
                <p>Delay (ms): <input type="number" value="${this.delay}" class="property${this.id}" min=0></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                this.delay = property[0].value;
                this.updateDiv();
            }

            super.properties();
        });
    }
}