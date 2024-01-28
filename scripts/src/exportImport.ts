function exportBlocks() {
    let blocks = convertConnectToToMap();
    let json = JSON.stringify(blocks, (key, value) => 
    {
        if (value instanceof Block) {
          return { __type: value.constructor.name, ...value };
        }
        return value;
    });
    
    let file = new Blob([json], {type: 'application/json'});
    let a = document.createElement('a');
    let filename = prompt("Enter project name:", "save");
    
    if(filename != null)
    {
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
                      return Object.assign(new ConditionBlock(value.x, value.y), value);
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
                    if(value == null) {
                        blocksList.push(null);
                        delete blocksList[blocksList.length-1];
                    }
                    return value;
                  });

                  convertMapToConnectTo();

                  blocksList.forEach((block: Block) => {
                    if(block != undefined)
                      block.update();
                  });

            } catch(e) {
                console.error(e);
                alert("Wystąpił błąd!");
            }
        }
        fileReader.readAsText(file, "utf-8");
    }
    input.click();
}