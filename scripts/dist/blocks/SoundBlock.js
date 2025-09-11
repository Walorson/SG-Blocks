class SoundBlock extends Block {
    constructor(x = 0, y = 0, sound = "rablax city") {
        super(x, y);
        this.waitTime = 0;
        this.sound = sound;
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block sound" id="${this.id}">Sound: <b>${this.sound}</b></div>`;
    }
    execute() {
        this.setActive();
        const audio = new Audio("sounds/" + this.sound + ".mp3");
        audio.play();
        if (this.waitMode == "Until the audio ends") {
            audio.addEventListener("ended", () => {
                this.executeNextBlock();
            });
        }
        else if (this.waitMode == "Custom") {
            runSpeed = this.waitTime;
            this.executeNextBlock();
            runSpeed = blocksList[0].runSpeed;
        }
        else {
            this.executeNextBlock();
        }
    }
    updateDiv() {
        this.div.innerHTML = `Sound: <b>${this.sound}</b>`;
        super.updateDiv();
    }
    properties() {
        this.div.addEventListener("mousedown", (e) => {
            if (e.button == 1)
                return;
            propertiesWindow.innerHTML = `
                <p>Sound: <select class="property${this.id}">
                    <option>rablax city</option>
                    <option>cześć_jarek</option>
                    <option>cześć_marek</option>
                    <option>wtf</option>
                </select></p>
                <p>Wait: <select class="property${this.id}">
                    <option>Run Speed time</option>
                    <option>Until the audio ends</option>
                    <option>Custom</option>
                </select></p>
                <p>Wait time (ms): <input type="number" class="property${this.id}" value="${this.waitTime}" disabled></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            console.log(property[0]);
            property[0].oninput = () => {
                this.sound = property[0].value;
                this.updateDiv();
            };
            property[1].oninput = () => {
                this.waitMode = property[1].value;
                if (property[1].value == "Custom")
                    property[2].removeAttribute("disabled");
                else
                    property[2].setAttribute("disabled", ";");
            };
            property[2].oninput = () => {
                this.waitTime = property[2].value;
            };
        });
        super.properties();
    }
}
