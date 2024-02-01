const displayTexts = document.getElementById("toolbar-display-texts");
displayTexts.onclick = () => {
    if (displayTexts.checked == false) {
        document.querySelectorAll(".text").forEach((text) => {
            text.style.display = "none";
        });
        buttons.text.setAttribute("disabled", ";");
    }
    else {
        document.querySelectorAll(".text").forEach((text) => {
            text.style.display = "";
        });
        buttons.text.removeAttribute("disabled");
    }
};
