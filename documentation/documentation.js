const aside = document.getElementById("aside");
const nav = document.getElementById("nav");

window.addEventListener("load", () => {
    aside.innerHTML = `
        <ul>
            <li><a href="start-block.html">Start Block</a></li>
            <li><a href="output-block.html">Output Block</a></li>
            <li><a href="input-block.html">Input Block</a></li>
            <li><a href="condition-block.html">Condition Block</a></li>
            <li><a href="opeartion-block.html">Operation Block</a></li>
            <li><a href="empty-block.html">Empty Block</a></li>
            <li><a href="end-block.html">End Block</a></li>
        </ul>
        <ul>
            <li><a href="random-block.html">Random Block</a></li>
            <li><a href="sound-block.html">Sound Block</a></li>
            <li><a href="delay-block.html">Delay Block</a></li>
            <li><a href="probality-block.html">Probality Block</a></li>
        </ul>
        <ul>
            <li><a href="variable-block.html">Variable Block</a></li>
            <li><a href="text-block.html">Text Block</a></li>
        </ul>
    `;

    nav.insertAdjacentHTML("beforeend",`
        <img src="../favicon.ico" height="70" width="70">
        <span class="title">
            <span class="title-letter">B</span>
            <span class="title-letter">l</span>
            <span class="title-letter">o</span>
            <span class="title-letter">c</span>
            <span class="title-letter">k</span>
            <span class="title-letter">s</span>
        </span> 
    `);
});