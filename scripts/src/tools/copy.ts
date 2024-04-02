let blocksToCopy: string = "";
let copyMode: boolean = false;

window.addEventListener("keydown", (e: KeyboardEvent) => 
{
    if(e.ctrlKey == true && e.key == "c" && isInputFocus == false) 
    {
        copySelectedBlock();
    }
});

function copySelectedBlock(): void
{
    blocksToCopy = "";
    let blocksToCopyList: Block[] = [];

    blocksList.forEach((block: Block) => {
        if(block.isSelected() && !(block instanceof StartBlock))
        {     
            blocksToCopyList.push(block);
        }
    });

    blocksToCopyList = convertConnectToToMap(blocksToCopyList);
    blocksToCopy = blocksToJSON(blocksToCopyList);
}