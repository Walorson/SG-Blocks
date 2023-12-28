const select = {
    startX: 0 as number,
    startY: 0 as number,
    width: 0 as number,
    height: 0 as number,
    div: null as HTMLElement,
    start: false as boolean
}

function selectBegin(e: MouseEvent): void {
    const clickedElement = e.target as HTMLElement;
    if(clickedElement.tagName != 'CANVAS' || e.button != 0) return;

    select.start = true;

    select.div = document.createElement("div");
    select.div.classList.add("select");
    select.div.setAttribute("id","select");
    workspace.appendChild(select.div);

    select.startX = e.clientX - workspaceMove.translateX;
    select.startY = e.clientY - workspaceMove.translateY;

    select.div.style.top = select.startY+"px";
    select.div.style.left = select.startX+"px";
}

function selectResize(e: MouseEvent): void {
    select.div = document.getElementById("select");
    
    const clientX = e.clientX - workspaceMove.translateX;
    const clientY = e.clientY - workspaceMove.translateY;

    select.width = clientX - select.startX;
    select.height = clientY - select.startY;

    select.div.style.height = Math.abs(select.height)+"px";
    select.div.style.width = Math.abs(select.width)+"px";

    if(select.width < 0)
    {
        select.div.style.left = clientX+"px";
    }
    if(select.height < 0)
    {
        select.div.style.top = clientY+"px";
    }
}

function selectEnd(e: MouseEvent): void {
    select.div = document.getElementById("select");

    workspace.removeChild(select.div);

    select.start = false;

    blocksList.forEach((block: Block) => {
        let inSelectY: boolean = false;
        let inSelectX: boolean = false;

        if(select.width >= 0)
        {
            if(block.x > select.startX && block.x < select.startX + select.width)
            {
                inSelectX = true;
            }
        }
        else
        {
            if(block.x < select.startX && block.x > select.startX + select.width)
            {
                inSelectX = true;
            }
        }

        if(select.height >= 0)
        {
            if(block.y > select.startY && block.y < select.startY + select.height)
            {
                inSelectY = true;
            }
        }
        else
        {
            if(block.y < select.startY && block.y > select.startY + select.height)
            {
                inSelectY = true;
            }
        }

        if((select.startX > block.x && select.startX < block.x + block.div.offsetWidth) || (select.startX + select.width > block.x && select.startX + select.width < block.x + block.div.offsetWidth))
        {
            inSelectX = true;
        }

        if((select.startY > block.y && select.startY < block.y + block.div.offsetHeight) || (select.startY + select.height > block.y && select.startY + select.height < block.y + block.div.offsetHeight))
        {
            inSelectY = true;
        }

        if(inSelectX == true && inSelectY == true)
        {
            block.setSelected();
        }
        
    });

    select.startX = null;
    select.startY = null;
    select.width = null;
    select.height = null;
}

function unselectAllBlocks(): void
{
    blocksList.forEach((block: Block) => {
        if(block.isSelected())
        {
            block.unsetSelected();
        }
    });
}