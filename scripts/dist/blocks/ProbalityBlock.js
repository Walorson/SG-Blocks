class ProbalityBlock extends Block {
    constructor(x = 0, y = 0, probality = 50) {
        super(x, y);
        this.probality = probality;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block probality" id="${this.id}">Probality: <i>50%</i></div>`;
    }
    updateDiv() {
        this.div.innerHTML = `Probality: <i>${this.probality}%</i></i>`;
        super.updateDiv();
    }
    connectToExecute() {
        setTimeout(() => {
            this.unsetActive();
            const rand = Math.ceil(Math.random() * 100);
            if (rand > 100 - this.probality)
                this.connectToTRUE.execute();
            else
                this.connectToFALSE.execute();
        }, runSpeed);
    }
    properties() {
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 1)
                return;
            propertiesWindow.innerHTML = `
                <p>Probality (%): <input type="number" value="${this.probality}" class="property${this.id}" min=0 max=100></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            property[0].oninput = () => {
                this.probality = property[0].value;
                this.updateDiv();
            };
            super.properties();
        });
    }
    updateConnectPoint(force = false) {
        if (this.connectTo.length <= 0 && this.connectToTRUE == undefined && this.connectToFALSE == undefined)
            return;
        const lines = this.getLines();
        let j = 0;
        for (let i = 0; i < lines.length; i++) {
            let angle;
            if (lines[i].colOriginal == 'green') {
                angle = this.angleBetween(this.connectToTRUE);
            }
            else if (lines[i].colOriginal == 'orange') {
                angle = this.angleBetween(this.connectToFALSE);
            }
            else {
                angle = this.angleBetween(this.connectTo[j]);
            }
            let direction = lines[i].right_node[lines[i].right_node.length - 1];
            const directionBeforeChange = direction;
            direction = newDirection(angle);
            if (direction == directionBeforeChange && force == false)
                continue;
            else {
                if (lines[i].colOriginal == 'green') {
                    lines[i].right_node = this.connectToTRUE.id + direction;
                }
                else if (lines[i].colOriginal == 'orange') {
                    lines[i].right_node = this.connectToFALSE.id + direction;
                }
                else {
                    lines[i].right_node = this.connectTo[j].id + direction;
                    j++;
                }
                lines[i].left_node = this.id + reverseDirection(direction);
            }
        }
    }
}
