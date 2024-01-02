const blocksToCopy = [];

window.addEventListener("keydown", (e: KeyboardEvent) => 
{
    if(e.ctrlKey == true && e.key == "c" && isInputFocus == false) 
    {
        copySelectedBlock();
    }
});

function copySelectedBlock(): void
{
    blocksToCopy.length = 0;

    blocksList.forEach((block: Block) => {
        if(block.isSelected() && !(block instanceof StartBlock)) blocksToCopy.push(block);
    });
}