const workspace: HTMLElement = document.getElementById("workspace");
let DEFAULT_BLOCK_X = 250;
let DEFAULT_BLOCK_Y = 75;
const blocksList = [];

abstract class Block {
    id: number;
    x: number;
    y: number;
    div: HTMLElement;
    maxConnects: number = 10;
    connectTo: Block[] = [];
    executeOnSpacePress: any;

    constructor(x: number, y: number) {
        this.id = blocksList.length;
        this.x = x;
        this.y = y;
        this.connectTo = [];
        this.executeOnSpacePress = (e: KeyboardEvent) => {
            if(e.key == ' ') this.connectToExecute();
        }
    }

    init(): void 
    {
        this.createBlock();
        
        blocksList.push(this);
        blocksList.forEach((block: Block) => 
        {
            block.update();
        });

        this.setPosition(this.x, this.y);
    }

    update(): void 
    {
        this.getID();
        this.dragAndDrop();
        this.properties();
        this.delete();
    }

    updateDiv(): void {}

    createBlock(): void {
        workspace.innerHTML += `<div class="block" id="${this.id}"></div>`;
    }

    setPosition(x: number, y: number): void {
        this.div.style.top = y+"px";
        this.div.style.left = x+"px";
    }

    getID(): void {
        this.div = document.getElementById(this.id+"");
    }
    
    execute(): void { 
        this.setActive();
        this.executeNextBlock();
    }

    executeNextBlock(): void
    {
        if(runStatus == false) return;

        if(autorun == true)
        {
            this.connectToExecute(); 
        }
        else
        {
            window.addEventListener("keypress", this.executeOnSpacePress);
        }
    }

    connectToExecute(): void {
        window.removeEventListener("keypress", this.executeOnSpacePress);
        setTimeout(() => 
        {
            executeHistory.push(this);

            if(this.connectTo.length <= 0) {
                endRun();
                return;
            }

            for(let i=0; i<this.connectTo.length; i++)
            {
                this.connectTo[i].execute();
            }

            this.unsetActive();

        }, runSpeed);
    }

    dragAndDrop(): void 
    {
        let isdrag: boolean = false;
        let grabPointX: number;
        let grabPointY: number;

        this.div.addEventListener("mousedown", (e: MouseEvent) => {
            mouseDown(e);
        });

        window.addEventListener("mousedown", (e: MouseEvent) => {
            setTimeout(() => {
                const elementClicked = e.target as HTMLElement;

                if(this.isSelected() && elementClicked.classList.contains("selected"))    
                {
                    mouseDown(e);
                }
            },5);
        })

        window.addEventListener("mousemove", (e: MouseEvent) => {
            mouseMove(e);
        });

        window.addEventListener("mouseup", (e: MouseEvent) => {
            mouseUp(e);
        })

        const mouseDown = (e: MouseEvent): void =>
        {        
            if(e.button == 2) {
                document.querySelectorAll(".block").forEach((block: HTMLElement) => block.style.cursor = 'cell');
                _canvas.style.cursor = 'cell';
            }
            if(e.button != 0 || deleteLineMode == true) return;
            
            this.div.style.cursor = "grabbing";

            isdrag = true;
            grabPointY = this.div.getBoundingClientRect().top - e.clientY;
            grabPointX = this.div.getBoundingClientRect().left - e.clientX;

            globalVariablesUpdate();
        }

        const mouseMove = (e: MouseEvent): void =>
        {
            if(e.button != 0) return;

            if(isdrag)
            {
                let x: number = e.clientX + grabPointX - workspaceMove.translateX;
                let y: number = e.clientY + grabPointY - workspaceMove.translateY;
                this.x = x;
                this.y = y;
                this.div.style.top = y+"px";
                this.div.style.left = x+"px";
            }
        }

        const mouseUp = (e: MouseEvent): void =>
        {
            document.querySelectorAll(".block").forEach((block: HTMLElement) => block.style.cursor = 'grab');
            _canvas.style.cursor = 'default';
            if(e.button != 0) return;

            isdrag = false;
        }
    }

    delete(): void {
        this.div.addEventListener("mousemove", () => {
            if(deleteLineMode == true)
            {
                this.div.style.border = "2px solid red";
                this.div.style.cursor = "crosshair";
            }
        });
        this.div.addEventListener("click", () => {
            if(deleteLineMode == true)
            {
                for(let j=0; j<_lines.length; j++)
                {
                    if(_lines[j].left_node == this.id || _lines[j].right_node == this.id) 
                    {
                        removeLine(j);
                        j=-1;
                    }
                } 

                workspace.removeChild(this.div);
                delete blocksList[this.id];

                propertiesWindow.innerHTML = '';
            }
        });
        
        this.div.addEventListener("mouseleave", () => {
            this.div.style.border = "";
        });
    }

    properties(): void {
        document.querySelectorAll("input").forEach((input: HTMLElement) => {      
            input.onfocus = () => { isInputFocus = true; }
            input.onblur = () => { isInputFocus = false;  }
        });
    }

    setActive(): void {
        this.div.classList.add("active");
    }
    unsetActive(): void {
        this.div.classList.remove("active");
    }
    setSelected(): void {
        this.div.classList.add("selected");
    }
    unsetSelected(): void {
        this.div.classList.remove("selected");
    }
    isSelected(): boolean {
        if(this.div.classList.contains("selected")) return true;
        else return false;
    }
}
