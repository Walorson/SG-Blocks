const ui: HTMLElement = document.getElementById("ui");
const propertiesWindow: HTMLElement = document.getElementById("properties");

const buttons = {
    output: document.getElementById("output-block-button"),
    input: document.getElementById("input-block-button"),
    condition: document.getElementById("condition-block-button"),
    run: document.getElementById("run-button")
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
buttons.run.addEventListener("click",() => {
    run();
});