const RUN_SPEED: number = 500; //in miliseconds
let deleteLineMode: boolean = false;
let executeHistory: Block[] = [];
let globalVariables: Map<string, any> = new Map();

new StartBlock(700, 50);
new OutputBlock(700, 350, "Siema");
new EndBlock(700, 600);

function run(): string
{
    executeHistory = [];
    blocksList[0].execute();
    return "START";
}