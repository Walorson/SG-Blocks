let settings = {
    shortOutputMessage: true as boolean,
    outputMessageLength: 18 as number
};

let settingsBeforeChange = { ...settings };

const settingsInput = {
    shortOutputMessage: document.getElementById("settings-shortOutputMessage") as HTMLInputElement,
    outputMessageLength: document.getElementById("settings-outputMessageLength") as HTMLInputElement
};

const settingsWindow = {
    window: document.getElementById("settings-window") as HTMLElement,
    quit: document.querySelector(".window-quit") as HTMLElement,
    apply: document.getElementById("settings-apply") as HTMLButtonElement,
    discard: document.getElementById("settings-discard") as HTMLButtonElement,
    isVisible: false as boolean,

    show: function() { 
        this.loadSettings();

        settingsWindow.window.style.display = 'block'; 
        this.isVisible = true;
    },

    hide: function() { 
        settingsWindow.window.style.display = 'none';
        this.isVisible = false;
    },

    loadSettings: function() {
        for(const key in settingsInput)
        {
            const type = settingsInput[key].getAttribute("type");

            if(type == 'checkbox') 
            {
                settingsInput[key].checked = settings[key];
            }
            else
            {
                settingsInput[key].value = settings[key];
            }
        }

        settingsInput.shortOutputMessage.dispatchEvent(new Event("input"));
    }
};

settingsWindow.quit.addEventListener("click", () => {
    settings = { ...settingsBeforeChange };
    settingsWindow.hide();
});

settingsWindow.apply.addEventListener("click", () => {
    settingsBeforeChange = { ...settings };

    blocksList.forEach((block: Block) => {
        if(block != undefined)
        {
            block.updateDiv();
        }
    });

    settingsWindow.hide();
});

settingsWindow.discard.addEventListener("click", () => {
    settings = { ...settingsBeforeChange };
    settingsWindow.hide();
})

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "q" && isInputFocus == false) 
    {
        if(settingsWindow.isVisible == false)
            settingsWindow.show();
        else
            settingsWindow.hide();
    }
});

settingsInput.shortOutputMessage.addEventListener("input",() => {
    if(settingsInput.shortOutputMessage.checked)
    {
        settings.shortOutputMessage = true;
        settingsInput.outputMessageLength.removeAttribute("disabled");
    }
    else
    {
        settings.shortOutputMessage = false;
        settingsInput.outputMessageLength.setAttribute("disabled",";");
    }
});

settingsInput.outputMessageLength.addEventListener("input", () => {
    settings.outputMessageLength = Number(settingsInput.outputMessageLength.value);
});