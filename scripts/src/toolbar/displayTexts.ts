const displayTexts: HTMLInputElement = document.getElementById("toolbar-display-texts") as HTMLInputElement;

displayTexts.onclick = () => {
    if(displayTexts.checked == false)
    {
        document.querySelectorAll(".text").forEach((text: HTMLElement) => {
            text.style.display = "none";
        });

        buttons.text.setAttribute("disabled",";");
    }
    else 
    {
        document.querySelectorAll(".text").forEach((text: HTMLElement) => {
            text.style.display = "";
        });

        buttons.text.removeAttribute("disabled");
    }
}