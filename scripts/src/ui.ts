const ui: HTMLElement = document.getElementById("ui");
const propertiesWindow: HTMLElement = document.getElementById("properties");

const buttons = {
    output: document.getElementById("output-block-button"),
    input: document.getElementById("input-block-button"),
    condition: document.getElementById("condition-block-button"),
    operation: document.getElementById("operation-block-button"),
    empty: document.getElementById("empty-block-button"),
    end: document.getElementById("end-block-button"),
    run: document.getElementById("run-button"),
    autorun: document.getElementById("autorun-checkbox") as HTMLInputElement
}

buttons.output.addEventListener("click", () => {
    new OutputBlock(250, 50);
});
buttons.input.addEventListener("click", () => {
    new InputBlock(250, 50, "a"+blocksList.length);
});
buttons.condition.addEventListener("click", () => {
    new ConditionBlock(250, 50);
})
buttons.operation.addEventListener("click",() => {
    new OperationBlock(250, 50);
});
buttons.empty.addEventListener("click", () => {
    new EmptyBlock(250, 50);
});
buttons.end.addEventListener("click", () => {
    new EndBlock(250, 50);
});
buttons.run.addEventListener("click",() => {
    run();
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