function exportBlocks() {
    let blocks = convertConnectToToMap(blocksList);
    let json = blocksToJSON(blocks);
    let file = new Blob([json], { type: 'application/json' });
    let a = document.createElement('a');
    let filename = prompt("Enter project name:", "save");
    if (filename != null) {
        a.download = "sg-" + filename + ".json";
        a.href = window.URL.createObjectURL(file);
        a.click();
        window.onbeforeunload = () => { ; };
    }
}
function importBlocks() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        let file = Array.from(input.files)[0];
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let json = fileReader.result;
            try {
                json = json + "";
                deleteAllBlocks();
                JSONtoBlocks(json);
                convertMapToConnectTo(blocksList);
                blocksList.forEach((block) => {
                    if (block != undefined) {
                        block.update();
                        block.updateDiv();
                    }
                });
                blocksList.forEach((block) => {
                    if (block != undefined) {
                        block.updateConnectPoint();
                    }
                });
                lastBlocksList = [];
                restoredBlocksList = [];
                undoRedoStep = 0;
                maxRedoStep = 0;
                moveWorkspaceTo(blocksList[0]);
            }
            catch (e) {
                console.error(e);
                alert("An error occurred! The save is invalid or corrupted.");
            }
        };
        fileReader.readAsText(file, "utf-8");
    };
    input.click();
}
function blocksToJSON(blocks) {
    return JSON.stringify(blocks, (key, value) => {
        if (value instanceof Block) {
            return Object.assign({ __type: value.constructor.name }, value);
        }
        return value;
    });
}
function JSONtoBlocks(json) {
    JSON.parse(json, (key, value) => {
        if (value && value.__type === 'StartBlock') {
            return Object.assign(new StartBlock(value.x, value.y), value);
        }
        if (value && value.__type === 'InputBlock') {
            return Object.assign(new InputBlock(value.x, value.y, value.variableName, value.message), value);
        }
        if (value && value.__type === 'OutputBlock') {
            return Object.assign(new OutputBlock(value.x, value.y, value.message, value.isVariable), value);
        }
        if (value && value.__type === 'ConditionBlock') {
            return Object.assign(new ConditionBlock(value.x, value.y, value.conditions), value);
        }
        if (value && value.__type === 'OperationBlock') {
            return Object.assign(new OperationBlock(value.x, value.y), value);
        }
        if (value && value.__type === 'EmptyBlock') {
            return Object.assign(new EmptyBlock(value.x, value.y), value);
        }
        if (value && value.__type === 'EndBlock') {
            return Object.assign(new EndBlock(value.x, value.y), value);
        }
        if (value && value.__type === 'TextBlock') {
            return Object.assign(new TextBlock(value.x, value.y), value);
        }
        if (value && value.__type === 'RandomBlock') {
            return Object.assign(new RandomBlock(value.x, value.y, value.min, value.max), value);
        }
        if (value && value.__type === 'VariableBlock') {
            return Object.assign(new VariableBlock(value.x, value.y), value);
        }
        if (value === null) {
            blocksList.push(null);
            delete blocksList[blocksList.length - 1];
        }
        return value;
    });
}
window.addEventListener("keydown", (e) => {
    if (e.altKey == true && e.key == "s" && isInputFocus == false) {
        exportBlocks();
    }
    if (e.altKey == true && e.key == "o" && isInputFocus == false) {
        importBlocks();
    }
    if (e.altKey == true && e.key == "n" && isInputFocus == false) {
        window.location.reload();
    }
});
