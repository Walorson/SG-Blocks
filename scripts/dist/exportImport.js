function exportBlocks(blocks) {
    let json = JSON.stringify(blocks);
    let file = new Blob([json], { type: 'application/json' });
    let a = document.createElement('a');
    let filename = prompt("Podaj nazwę projektu:");
    a.download = filename + ".json";
    a.href = window.URL.createObjectURL(file);
    a.click();
}
function importBlocks() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        let file = Array.from(input.files)[0];
        let fr = new FileReader();
        fr.onload = () => {
            let json = fr.result;
            try {
                json = json + "";
                let parsedJson = JSON.parse(json);
                deleteLineMode = true;
                blocksList.forEach((block) => {
                    block.deleteBlock(true, false, true);
                });
                deleteLineMode = false;
                blocksList = [];
                let list = parsedJson;
                list.forEach((block, index) => {
                    if (block != undefined) {
                        let blockToPaste = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
                        blockToPaste.id = index;
                        blockToPaste.init();
                    }
                    else {
                        blocksList.push(undefined);
                        delete blocksList[index];
                    }
                });
                blocksList.forEach((block) => {
                    let realConnectTo = [];
                    block.connectTo.forEach((id) => {
                        realConnectTo.push(blocksList[id]);
                    });
                    block.connectTo = realConnectTo;
                });
                blocksList.forEach((blockStart) => {
                    if (blockStart.connectTo.length > 0) {
                        blockStart.connectTo.forEach((blockEnd) => {
                            connectLine(blockStart, blockEnd, "normal", true);
                        });
                    }
                    if (blockStart instanceof ConditionBlock) {
                        if (blockStart.connectToTRUE != undefined) {
                            blockStart.connectToTRUE = blocksList[blockStart.connectToTRUE];
                            connectLine(blockStart, blockStart.connectToTRUE, "true", true);
                        }
                        if (blockStart.connectToFALSE != undefined) {
                            blockStart.connectToFALSE = blocksList[blockStart.connectToFALSE];
                            connectLine(blockStart, blockStart.connectToFALSE, "false", true);
                        }
                    }
                });
            }
            catch (e) {
                console.error(e);
                alert("Wystąpił błąd!");
            }
        };
        fr.readAsBinaryString(file);
    };
    input.click();
}
