const settingsWindow = {
    window: document.getElementById("settings-window"),
    quit: document.querySelector(".window-quit")
};

settingsWindow.quit.addEventListener("click", () => {
    settingsWindow.window.style.display = 'none';
});