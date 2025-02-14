let settings = {
    shortOutputMessage: true,
    outputMessageLength: 18,
    theme: "Light",
    defaultVariablePrefix: "var",
    workspaceMoveDuringRun: true
};
let settingsBeforeChange;
const settingsInput = {
    shortOutputMessage: document.getElementById("settings-shortOutputMessage"),
    outputMessageLength: document.getElementById("settings-outputMessageLength"),
    theme: document.getElementById("settings-theme"),
    defaultVariablePrefix: document.getElementById("settings-defaultVariablePrefix"),
    workspaceMoveDuringRun: document.getElementById("settings-workspaceMoveDuringRun")
};
const settingsWindow = {
    window: document.getElementById("settings-window"),
    quit: document.querySelector(".window-quit"),
    apply: document.getElementById("settings-apply"),
    discard: document.getElementById("settings-discard"),
    isVisible: false,
    show: function () {
        this.loadSettings();
        settingsWindow.window.style.display = 'block';
        this.isVisible = true;
    },
    hide: function () {
        settingsWindow.window.style.display = 'none';
        this.isVisible = false;
    },
    loadSettings: function () {
        for (const key in settingsInput) {
            const type = settingsInput[key].getAttribute("type");
            if (type == 'checkbox') {
                settingsInput[key].checked = settings[key];
            }
            else {
                settingsInput[key].value = settings[key];
            }
        }
        settingsInput.shortOutputMessage.dispatchEvent(new Event("input"));
    }
};
settingsWindow.quit.addEventListener("click", () => {
    settings = Object.assign({}, settingsBeforeChange);
    settingsWindow.hide();
});
settingsWindow.apply.addEventListener("click", () => {
    settingsBeforeChange = Object.assign({}, settings);
    blocksList.forEach((block) => {
        if (block != undefined) {
            block.updateDiv();
        }
    });
    localStorage.setItem("settings", JSON.stringify(settings));
    settingsWindow.hide();
});
settingsWindow.discard.addEventListener("click", () => {
    settings = Object.assign({}, settingsBeforeChange);
    settingsWindow.hide();
});
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey == true && e.key == "q" && isInputFocus == false) {
        if (settingsWindow.isVisible == false)
            settingsWindow.show();
        else
            settingsWindow.hide();
    }
});
settingsInput.shortOutputMessage.addEventListener("input", () => {
    if (settingsInput.shortOutputMessage.checked) {
        settings.shortOutputMessage = true;
        settingsInput.outputMessageLength.removeAttribute("disabled");
    }
    else {
        settings.shortOutputMessage = false;
        settingsInput.outputMessageLength.setAttribute("disabled", ";");
    }
});
settingsInput.workspaceMoveDuringRun.addEventListener("input", () => {
    if (settingsInput.workspaceMoveDuringRun.checked) {
        settings.workspaceMoveDuringRun = true;
    }
    else {
        settings.workspaceMoveDuringRun = false;
    }
});
settingsInput.outputMessageLength.addEventListener("input", () => {
    settings.outputMessageLength = Number(settingsInput.outputMessageLength.value);
});
settingsInput.theme.addEventListener("input", () => {
    settings.theme = settingsInput.theme.value;
    theme.setAttribute("href", `css/theme/${settings.theme.toLowerCase()}.css`);
    setTimeout(() => {
        defaultLineColor = getComputedStyle(document.documentElement).getPropertyValue('--line-color');
        _lines.forEach((line) => {
            line.col = defaultLineColor;
            line.colOriginal = defaultLineColor;
        });
    }, 50);
});
settingsInput.defaultVariablePrefix.addEventListener("input", () => {
    settings.defaultVariablePrefix = settingsInput.defaultVariablePrefix.value;
});
window.addEventListener("load", () => {
    if (localStorage.getItem("settings") != null) {
        settings = JSON.parse(localStorage.getItem("settings"));
    }
    settingsBeforeChange = Object.assign({}, settings);
    blocksList.forEach((block) => {
        if (block != undefined) {
            block.updateDiv();
        }
    });
    theme.setAttribute("href", `css/theme/${settings.theme.toLowerCase()}.css`);
    setTimeout(() => {
        defaultLineColor = getComputedStyle(document.documentElement).getPropertyValue('--line-color');
    }, 50);
});
