const settingsWindow = {
    window: document.getElementById("settings-window") as HTMLElement,
    quit: document.querySelector(".window-quit") as HTMLElement,
    isVisible: false as boolean,

    show: function() { 
        settingsWindow.window.style.display = 'block'; 
        this.isVisible = true;
    },
    hide: function() { 
        settingsWindow.window.style.display = 'none';
        this.isVisible = false; 
    }
};

settingsWindow.quit.addEventListener("click", () => {
    settingsWindow.hide();
});

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.ctrlKey == true && e.key == "q" && isInputFocus == false) 
    {
        if(settingsWindow.isVisible == false)
            settingsWindow.show();
        else
            settingsWindow.hide();
    }
});