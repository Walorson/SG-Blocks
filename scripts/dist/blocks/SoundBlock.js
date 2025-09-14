class SoundBlock extends Block {
    constructor(x = 0, y = 0, sound = "C6", waitMode = "Run Speed time", waitTime = 0, category = "Keyboard") {
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
        this.keyboardCategory = `<option>D5</option><option>D#5</option><option>E5</option><option>F5</option><option>F#5</option><option>G5</option><option>G#5</option><option>A5</option><option>A#5</option><option>B5</option><option>C6</option><option>C#6</option><option>D6</option><option>D#6</option><option>E6</option><option>F6</option><option>F#6</option><option>G6</option><option>G#6</option><option>A6</option><option>A#6</option><option>B6</option><option>C7</option><option>C#7</option>
        `;
        this.otherCategory = `<option>accept</option><option>beep</option><option>cheers</option><option>clock</option><option>ding</option><option>error</option><option>level up</option><option>press</option><option>reject</option><option>zap</option>`;
        this.drumCategory = `<option>kick</option><option>snare</option><option>hat</option><option>hi hat</option><option>clap</option>`;
        this.guitarCategory = `
            <option>D3</option>
            <option>D#3</option>
            <option>E3</option>
            <option>F3</option>
            <option>F#3</option>
            <option>G3</option>
            <option>G#3</option>
            <option>A3</option>
            <option>A#3</option>
            <option>B3</option>
            <option>C4</option>
            <option>C#4</option>
            <option>D4</option>
            <option>D#4</option>
            <option>E4</option>
            <option>F4</option>
            <option>F#4</option>
            <option>G4</option>
            <option>G#4</option>
            <option>A4</option>
            <option>A#4</option>
            <option>B4</option>
            <option>C5</option>
            <option>C5</option>
            <option>C#5</option>
            <option>D5</option>
            <option>D#5</option>
        `;
    }
    execute() {
        this.setActive();
        const audio = new Audio(`sounds/${this.category.toLowerCase()}/${encodeURIComponent(this.sound)}.mp3`);
        audio.play();
        if (this.waitMode == "Until the sound ends") {
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
                    <option>Guitar</option>
                    <option>Drum</option>
                    <option>Other</option>
                </select></p>
                <p>Sound: <select class="property${this.id} no-hover" size=6 style="width: 100px">
                </select></p>
                <p>Wait: <select class="property${this.id}">
                    <option>Run Speed time</option>
                    <option>Until the sound ends</option>
                    <option>Custom</option>
                </select></p>
                <p>Wait time (ms): <input type="number" class="property${this.id}" value="${this.waitTime}"></p>
            `;
            const property = propertiesWindow.querySelectorAll(".property" + this.id);
            const updateCategories = (onChange = true) => {
                if (this.category == "Keyboard") {
                    property[1].innerHTML = this.keyboardCategory;
                    property[1].value = "C6";
                }
                else if (this.category == "Drum") {
                    property[1].innerHTML = this.drumCategory;
                    property[1].value = "kick";
                }
                else if (this.category == "Guitar") {
                    property[1].innerHTML = this.guitarCategory;
                    property[1].value = "E4";
                }
                else if (this.category == "Other") {
                    property[1].innerHTML = this.otherCategory;
                    property[1].value = "accept";
                }
                if (onChange == true) {
                    this.sound = property[1].value;
                    this.updateDiv();
                }
            };
            updateCategories(false);
            property[0].value = this.category;
            property[0].oninput = () => {
                this.category = property[0].value;
                updateCategories();
            };
            property[1].value = this.sound;
            property[1].oninput = () => {
                this.sound = property[1].value;
                this.updateDiv();
            };
            property[2].value = this.waitMode;
            property[2].oninput = () => {
                this.waitMode = property[2].value;
                if (property[2].value == "Custom")
                    property[3].removeAttribute("disabled");
                else
                    property[3].setAttribute("disabled", ";");
            };
            property[3].oninput = () => {
                this.waitTime = property[3].value;
            };
            if (property[2].value != "Custom")
                property[3].setAttribute("disabled", ";");
        });
        super.properties();
    }
}
