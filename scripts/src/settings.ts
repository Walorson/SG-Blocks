let settings = {
    shortOutputMessage: true as boolean,
    outputMessageLength: 18 as number,
    theme: "Light" as string
};

let settingsBeforeChange: any;

const settingsInput = {
    shortOutputMessage: document.getElementById("settings-shortOutputMessage") as HTMLInputElement,
    outputMessageLength: document.getElementById("settings-outputMessageLength") as HTMLInputElement,
    theme: document.getElementById("settings-theme") as HTMLInputElement
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

    localStorage.setItem("settings", JSON.stringify(settings));
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

settingsInput.theme.addEventListener("input", () => {
    settings.theme = settingsInput.theme.value;
    theme.setAttribute("href", `css/theme/${settings.theme.toLowerCase()}.css`);
    defaultLineColor = getComputedStyle(document.documentElement).getPropertyValue('--line-color');
});

window.addEventListener("load",() => {
    if(localStorage.getItem("settings") != null)
    {
        settings = JSON.parse(localStorage.getItem("settings"));
    }

    settingsBeforeChange = { ...settings };

    blocksList.forEach((block: Block) => {
        if(block != undefined)
        {
            block.updateDiv();
        }
    });

    theme.setAttribute("href", `css/theme/${settings.theme.toLowerCase()}.css`);
    defaultLineColor = getComputedStyle(document.documentElement).getPropertyValue('--line-color');
});