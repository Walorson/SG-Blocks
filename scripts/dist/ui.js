const ui = document.getElementById("ui");
const propertiesWindow = document.getElementById("properties");
const buttons = {
    output: document.getElementById("output-block-button"),
    input: document.getElementById("input-block-button"),
    condition: document.getElementById("condition-block-button"),
    operation: document.getElementById("operation-block-button"),
    empty: document.getElementById("empty-block-button"),
    end: document.getElementById("end-block-button"),
    run: document.getElementById("run-button"),
    autorun: document.getElementById("autorun-checkbox")
};
const nav = {
    file: document.getElementById("nav-file-button"),
    edit: document.getElementById("nav-edit-button"),
    help: document.getElementById("nav-help-button")
};
buttons.output.addEventListener("click", () => {
    saveBlockState();
    new OutputBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.input.addEventListener("click", () => {
    saveBlockState();
    new InputBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y, "a" + blocksList.length);
});
buttons.condition.addEventListener("click", () => {
    saveBlockState();
    new ConditionBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.operation.addEventListener("click", () => {
    saveBlockState();
    new OperationBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.empty.addEventListener("click", () => {
    saveBlockState();
    new EmptyBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.end.addEventListener("click", () => {
    saveBlockState();
    new EndBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.run.addEventListener("click", () => {
    run();
});
buttons.autorun.addEventListener("input", () => {
    if (buttons.autorun.checked) {
        autorun = true;
        runSpeed = blocksList[0].runSpeed;
    }
    else {
        autorun = false;
        runSpeed = 50;
    }
});
nav.help.addEventListener("mouseenter", () => {
    document.getElementById("controls").style.display = 'block';
});
nav.help.addEventListener("mouseleave", () => {
    document.getElementById("controls").style.display = '';
});
{
    let option = nav.edit.querySelectorAll("li");
    option[0].onclick = () => { undo(); };
    option[1].onclick = () => { redo(); };
    option[2].onclick = () => { copySelectedBlock(); };
    option[3].onclick = () => { pasteBlocks(); };
    option[4].onclick = () => { pasteBlocks(); };
    option[5].onclick = () => { selectAllBlocks(); };
    option[6].onclick = () => { invertSelection(); };
    option[7].onclick = () => { deleteSelectedBlocks(); };
}
{
    let option = nav.file.querySelectorAll("li");
    option[1].onclick = () => { exportBlocks(blocksList); };
    option[2].onclick = () => { importBlocks(); };
}
document.querySelectorAll(".sub-menu").forEach((subMenu) => {
    subMenu.onclick = () => {
        subMenu.style.display = 'none';
        setTimeout(() => { subMenu.style.display = ''; }, 1);
    };
});
