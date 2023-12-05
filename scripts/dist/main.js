const RUN_SPEED = 500; //in miliseconds
let deleteLineMode = false;
let executeHistory = [];
let globalVariables = new Map();
new StartBlock(700, 50);
new OutputBlock(700, 350, "Siema");
new EndBlock(700, 600);
function run() {
    executeHistory = [];
    blocksList[0].execute();
    return "START";
}
