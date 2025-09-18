class ProbalityBlock extends Block {
    probality: number;
    connectToTRUE: Block | any;
    connectToFALSE: Block | any;
    constructor(x: number = 0, y: number = 0, probality: number = 50) {
        super(x, y);
        this.probality = probality;
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block probality" id="${this.id}">Probality: <i>50%</i></div>`;
    }

    updateDiv(): void {
        this.div.innerHTML = `Probality: <i>${this.probality}%</i></i>`;
        super.updateDiv();
    }

    connectToExecute(): void {
        setTimeout(() => {
            executeHistory.push(this);
            this.unsetActive();

            const rand = Math.ceil(Math.random()*100);
            if(rand > 100 - this.probality && this.connectToTRUE != undefined)
                this.connectToTRUE.execute();
            else if(this.connectToFALSE != undefined)
                this.connectToFALSE.execute();
            else if(this.connectToTRUE == undefined && this.connectToFALSE == undefined)
            {
                for(let i=0; i<this.connectTo.length; i++)
                {
                    this.connectTo[i].execute();
                }
            }
            else endRun();

        }, runSpeed);
    }

    properties(): void {
        this.div.addEventListener("mousedown", (e: MouseEvent) => {
            if(e.button == 1) return;

            propertiesWindow.innerHTML = `
                <p>Probality (%): <input type="number" value="${this.probality}" class="property${this.id}" min=0 max=100></p>
                <p>*Hold Z key and right mouse button to connect <b>SUCCESS</b> Line</p>
                <p>*Hold X key and right mouse button to connect <b>FAILURE</b> Line</p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);
            
            property[0].oninput = () => {
                this.probality = property[0].value;
                this.updateDiv();
            }

            super.properties();
        });
    }

    updateConnectPoint(force: boolean = false): void {
        if(this.connectTo.length <= 0 && this.connectToTRUE == undefined && this.connectToFALSE == undefined) return;

        const lines: any = this.getLines();

        let j = 0;
        for(let i=0; i<lines.length; i++)
        {
            let angle: number;
            if(lines[i].colOriginal == 'green') 
            {
                angle = this.angleBetween(this.connectToTRUE);
            }
            else if(lines[i].colOriginal == 'orange') 
            {
                angle = this.angleBetween(this.connectToFALSE)
            }
            else 
            {
                angle = this.angleBetween(this.connectTo[j]);
            }

            let direction: string = lines[i].right_node[lines[i].right_node.length-1];
            const directionBeforeChange: string = direction;

            direction = newDirection(angle);

            if(direction == directionBeforeChange && force == false) continue;
            else 
            {
                if(lines[i].colOriginal == 'green')
                {
                    lines[i].right_node = this.connectToTRUE.id + direction;
                }
                else if(lines[i].colOriginal == 'orange')
                {
                    lines[i].right_node = this.connectToFALSE.id + direction;
                }
                else
                {
                    lines[i].right_node = this.connectTo[j].id + direction;
                    j++;
                }

                lines[i].left_node = this.id + reverseDirection(direction);
            }
        }
    }
}