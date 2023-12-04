let deleteLineMode = false;
let executeHistory = [];
function findKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] == value);
}
new Start(700, 50);
new Output(700, 350, "Siema");
new End(700, 600);
function run() {
    executeHistory = [];
    blocksList[0].execute();
    return "START";
}
