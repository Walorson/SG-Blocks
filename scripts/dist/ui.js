const ui = document.getElementById("ui");
const propertiesWindow = document.getElementById("properties");
const buttons = {
    output: document.getElementById("output-block-button"),
    input: document.getElementById("input-block-button"),
    condition: document.getElementById("condition-block-button"),
    operation: document.getElementById("operation-block-button"),
    empty: document.getElementById("empty-block-button"),
    end: document.getElementById("end-block-button"),
    run: document.getElementById("run-button")
};
buttons.output.addEventListener("click", () => {
    new OutputBlock(250, 50);
});
buttons.input.addEventListener("click", () => {
    new InputBlock(250, 50, "a" + blocksList.length);
});
buttons.condition.addEventListener("click", () => {
    new ConditionBlock(250, 50);
});
buttons.operation.addEventListener("click", () => {
    new OperationBlock(250, 50);
});
buttons.empty.addEventListener("click", () => {
    new EmptyBlock(250, 50);
});
buttons.end.addEventListener("click", () => {
    new EndBlock(250, 50);
});
buttons.run.addEventListener("click", () => {
    run();
});
