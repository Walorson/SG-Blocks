class SoundBlock extends Block {
    constructor(x = 0, y = 0, sound = "rablax city", waitMode = "Run Speed time", waitTime = 0, category = "Keyboard") {
        super(x, y);
        this.category = category;
        this.sound = sound;
        this.waitMode = waitMode;
        this.waitTime = waitTime;
        this.initCategories();
        this.init();
    }
    createBlock() {
        workspace.innerHTML += `<div class="block sound" id="${this.id}">Sound: <b>${this.sound}</b></div>`;
    }
    initCategories() {
        this.keyboardCategory = `
        <option selected>D5</option>
        <option>E5</option>
        <option>F5</option>
        <option>G5</option>
        <option>A5</option>
        <option>B5</option>
        <option>C6</option>
        <option>D6</option>
        <option>E6</option>
        <option>F6</option>
        <option>G6</option>
        <option>A6</option>
        <option>B6</option>
        <option>C7</option>
        `;
    }
    execute() {
        this.setActive();
        const audio = new Audio(`sounds/${this.category.toLowerCase()}/${this.sound}.mp3`);
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
                <p>Category: <select class="property${this.id}">
                    <option>Keyboard</option>
                    <option>Other</option>
                </select></p>
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
                <p>Wait time (ms): <input type="number" class="property${this.id}" value="${this.waitTime}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            const setCategories = () => {
                if (property[0].value == "Keyboard") {
                    property[1].innerHTML = this.keyboardCategory;
                }
                else if (property[0].value == "Other") {
                }
            };
            setCategories();
            property[0].oninput = () => {
                setCategories();
            };
            property[1].value = this.sound;
            property[1].oninput = () => {
                this.sound = property[1].value;
                this.updateDiv();
            };
            property[2].value = this.waitMode;
            property[2].oninput = () => {
                this.waitMode = property[1].value;
                if (property[1].value == "Custom")
                    property[3].removeAttribute("disabled");
                else
                    property[3].setAttribute("disabled", ";");
            };
            property[3].oninput = () => {
                this.waitTime = property[2].value;
            };
            if (property[2].value != "Custom")
                property[3].setAttribute("disabled", ";");
        });
        super.properties();
    }
}
