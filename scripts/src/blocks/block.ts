const workspace: HTMLElement = document.getElementById("workspace");
const blocksList = [];

class Block {
    id: number;
    x: number;
    y: number;
    div: HTMLElement;
    maxConnects: number = 1;
    connectTo: Block[] = [];

    constructor(x: number, y: number) {
        this.id = blocksList.length;
        this.x = x;
        this.y = y;
        this.connectTo = [];
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
        this.connect();
        this.dragAndDrop();
        this.properties();
        this.delete();
    }

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
    
    execute(): void { this.connectToExecute(); }

    connect(): void { }

    connectToExecute(): void {
        setTimeout(() => 
        {
            executeHistory.push(this);

            if(this.connectTo.length <= 0) {
                runStatus = false;
                buttons.run.removeAttribute("disabled");
                return;
            }

            for(let i=0; i<this.connectTo.length; i++)
            {
                if(executeHistory[executeHistory.length-2] == this.connectTo[i]) {
                    if(this.connectTo.length <= 1) {
                        runStatus = false;
                        buttons.run.removeAttribute("disabled");
                    }
                    continue;
                }
                this.connectTo[i].execute();
            }

        }, runSpeed);
    }

    dragAndDrop(): void 
    {
        let isdrag: boolean = false;
        let grabPointX: number;
        let grabPointY: number;

        this.div.addEventListener("mousedown", (e: MouseEvent) => {
            if(e.button != 0) return;

            isdrag = true;
            grabPointY = this.div.getBoundingClientRect().top - e.clientY;
            grabPointX = this.div.getBoundingClientRect().left - e.clientX;

            globalVariablesUpdate();
        });

        window.addEventListener("mousemove", (e: MouseEvent) => {
            if(e.button != 0) return;

            if(isdrag)
            {
                let x: number = e.clientX + grabPointX;
                let y: number = e.clientY + grabPointY;
                this.x = x;
                this.y = y;
                this.div.style.top = y+"px";
                this.div.style.left = x+"px";
            }
            
        });

        window.addEventListener("mouseup", (e: MouseEvent) => {
            if(e.button != 0) return;

            isdrag = false;
        })
    }

    delete(): void {
        this.div.addEventListener("mousemove", () => {
            if(deleteLineMode == true)
            {
                this.div.style.border = "2px solid red";
            }
        });
        this.div.addEventListener("click", () => {
            if(deleteLineMode == true)
            {
                const connectToLength: number = this.connectTo.length;
                for(let i=0; i<connectToLength; i++)
                {
                    for(let j=0; j<_lines.length; j++)
                    {
                        if(_lines[j].left_node == this.id || _lines[j].right_node == this.id) 
                        {
                            removeLine(j);
                            break;
                        }
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

    properties(): void {}
}