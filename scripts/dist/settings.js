const settingsWindow = {
    window: document.getElementById("settings-window"),
    quit: document.querySelector(".window-quit"),
    isVisible: false,
    show: function () {
        settingsWindow.window.style.display = 'block';
        this.isVisible = true;
    },
    hide: function () {
        settingsWindow.window.style.display = 'none';
        this.isVisible = false;
    }
};
settingsWindow.quit.addEventListener("click", () => {
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
