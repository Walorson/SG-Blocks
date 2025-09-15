const ui: HTMLElement = document.getElementById("ui");
const propertiesWindow: HTMLElement = document.getElementById("properties");

const buttons = {
    output: document.getElementById("output-block-button"),
    input: document.getElementById("input-block-button"),
    condition: document.getElementById("condition-block-button"),
    operation: document.getElementById("operation-block-button"),
    empty: document.getElementById("empty-block-button"),
    end: document.getElementById("end-block-button"),
    random: document.getElementById("random-block-button"),
    sound: document.getElementById("sound-block-button"),
    delay: document.getElementById("delay-block-button"),
    probality: document.getElementById("probality-block-button"),
    text: document.getElementById("text-misc-button"),
    variable: document.getElementById("variable-misc-button"),
    run: document.getElementById("run-button"),
    autorun: document.getElementById("autorun-checkbox") as HTMLInputElement
}

const nav = {
    file: document.getElementById("nav-file-button") as HTMLElement,
    edit: document.getElementById("nav-edit-button") as HTMLElement,
    settings: document.getElementById("nav-settings-button") as HTMLElement,
    help: document.getElementById("nav-help-button") as HTMLElement
}

const blocksCategories = {
    basic: document.getElementById("blocks-categories-basic-button"),
    special: document.getElementById("blocks-categories-special-button"),
    misc: document.getElementById("blocks-categories-misc-button")
}

buttons.output.addEventListener("click", () => {
    saveBlockState();
    new OutputBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.input.addEventListener("click", () => {
    saveBlockState();
    new InputBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y, settings.defaultVariablePrefix + (globalVariables.size+1));
});
buttons.condition.addEventListener("click", () => {
    saveBlockState();
    new ConditionBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
})
buttons.operation.addEventListener("click",() => {
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
buttons.random.addEventListener("click", () => {
    saveBlockState();
    new RandomBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.sound.addEventListener("click", () => {
    saveBlockState();
    new SoundBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.delay.addEventListener("click", () => {
    saveBlockState();
    new DelayBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.probality.addEventListener("click", () => {
    saveBlockState();
    new ProbalityBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.text.addEventListener("click", () => {
    saveBlockState();
    new TextBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.variable.addEventListener("click", () => {
    saveBlockState();
    new VariableBlock(DEFAULT_BLOCK_X, DEFAULT_BLOCK_Y);
});
buttons.run.addEventListener("click",() => {
    run();
    buttons.run.blur();
});
buttons.autorun.addEventListener("input", () => {
    if(buttons.autorun.checked)
    {
        autorun = true;
        runSpeed = blocksList[0].runSpeed;
    }
    else
    {
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
    option[0].onclick = () => { undo(); }
    option[1].onclick = () => { redo(); }
    option[2].onclick = () => { copySelectedBlock(); }
    option[3].onclick = () => { pasteBlocks(); }
    option[4].onclick = () => { pasteBlocks(); }

    option[5].onclick = () => { selectAllBlocks(); }
    option[6].onclick = () => { invertSelection(); }

    option[7].onclick = () => { deleteSelectedBlocks(); }
}

{
    let option = nav.file.querySelectorAll("li");
    option[0].onclick = () => { window.location.reload(); }
    option[1].onclick = () => { exportBlocks(); }
    option[2].onclick = () => { importBlocks(); }
}

{
    let option = nav.settings.querySelectorAll("li");
    option[0].onclick = () => { settingsWindow.show(); }
}

document.querySelectorAll(".sub-menu").forEach((subMenu: HTMLElement) => {
    subMenu.onclick = () => { 
        subMenu.style.display = 'none'; 
        setTimeout(() => { subMenu.style.display = ''; },1);
    }
});

function changeBlocksCategory(category: string)
{
    document.querySelectorAll(".block-box").forEach((blockBox: HTMLElement) => {
        blockBox.style.display = 'none';
    });

    document.getElementById("block-box-"+category).style.display = '';
}

blocksCategories.basic.onclick = () => {
    changeBlocksCategory("basic");
}
blocksCategories.special.onclick = () => {
    changeBlocksCategory("special");
}
blocksCategories.misc.onclick = () => {
    changeBlocksCategory("misc");
}