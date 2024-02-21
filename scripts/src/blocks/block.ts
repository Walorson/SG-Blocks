const workspace: HTMLElement = document.getElementById("workspace");
let DEFAULT_BLOCK_X = 250;
let DEFAULT_BLOCK_Y = 75;
let blocksList = [];

abstract class Block {
    id: number;
    x: number;
    y: number;
    div: HTMLElement;
    maxConnects: number = 10;
    connectTo: Block[] = [];
    executeOnSpacePress: any;
    isDeletable: boolean = true;

    constructor(x: number = 0, y: number = 0) {
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

        this.move(this.x, this.y);
        this.updateDiv();
    }

    update(): void 
    {
        this.getID();
        this.dragAndDrop();
        this.selectEvent();
        this.properties();
        this.delete();
    }

    updateDiv(): void { this.addConnectPoints(); }

    createBlock(): void {
        workspace.innerHTML += `<div class="block" id="${this.id}"></div>`;
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

        this.div.onmousedown = (e: MouseEvent) => {
            if(e.button == 0)
                saveBlockState(); 
        }

        this.div.onmousemove = (e: MouseEvent) => {
            cursorX = this.x + e.offsetX + 1;
            cursorY = this.y + e.offsetY + 1;
            displayCoords();
        }

        window.addEventListener("mousedown", (e: MouseEvent) => {
            setTimeout(() => {
                let elementClicked = e.target as HTMLElement;

                if(elementClicked.tagName == 'B')
                    elementClicked = elementClicked.parentElement;

                if(elementClicked.tagName == 'I')
                    elementClicked = elementClicked.parentElement;

                if(elementClicked.tagName == 'SPAN')
                    elementClicked = elementClicked.parentElement;
                
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
        }

        const mouseMove = (e: MouseEvent): void =>
        {
            if(e.button != 0) return;

            if(isdrag)
            {
                let x: number = e.clientX + grabPointX - workspaceMove.translateX;
                let y: number = e.clientY + grabPointY - workspaceMove.translateY;

                if(grid.snap == true)
                {
                    x = Math.round(x/25)*25;
                    y = Math.round(y/25)*25;
                }

                this.x = x;
                this.y = y;
                this.div.style.top = y+"px";
                this.div.style.left = x+"px";

                blocksList.forEach((block: Block) => {
                    if(block != undefined) {
                        block.updateConnectPoint();
                    }
                });
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
                this.div.style.borderColor = "red";
                this.div.style.cursor = "crosshair";
            }
        });
        this.div.addEventListener("click", () => {
            if(deleteLineMode == true)
            {
                this.deleteBlock();
            }
        });
        this.div.addEventListener("mouseleave", () => {
            this.div.style.border = "";
        });
    }

    properties(): void {
        document.querySelectorAll("input, textarea").forEach((input: HTMLElement) => {      
            input.onfocus = () => { isInputFocus = true; }
            input.onblur = () => { isInputFocus = false;  }
        });
    }

    deleteBlock(forceDeletion: boolean = false, multipleDeletion: boolean = false, dontSaveBlockState: boolean = false)
    {
        if(this.isDeletable == false && forceDeletion == false) return;

        if(forceDeletion == false && multipleDeletion == false) saveBlockState();

        let linesRemoved: number = 0;

        for(let j=0; j<_lines.length; j++)
        {
            if(_lines[j].left_node_id == this.id || _lines[j].right_node_id == this.id) 
            {       
                removeLine(j, dontSaveBlockState);
                linesRemoved++;
                j = -1;
            }
        } 

        this.div.remove();
        delete blocksList[this.id];

        propertiesWindow.innerHTML = '';
    }

    selectEvent() {
        this.div.addEventListener("mousedown", (e: MouseEvent) => {
            if(shiftPressed == false && e.button != 1 && this.isSelected() == false) unselectAllBlocks();

            this.setSelected(); 
        });
    }

    move(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.div.style.top = y+"px";
        this.div.style.left = x+"px";
    }

    addConnectPoints(): void {
        this.div.innerHTML += 
        `<div class="connectPoint" id="${this.id}n"></div>
        <div class="connectPoint" id="${this.id}e"></div>
        <div class="connectPoint" id="${this.id}s"></div>
        <div class="connectPoint" id="${this.id}w"></div>`;
    }

    updateConnectPoint(force: boolean = false): void {
        if(this.connectTo.length <= 0) return;

        const lines: any = this.getLines();

        for(let i=0; i<lines.length; i++)
        {
            let angle: number = this.angleBetween(this.connectTo[i]);
            let direction: string = lines[i].right_node[lines[i].right_node.length-1];
            const directionBeforeChange: string = direction;

            direction = newDirection(angle);

            if(direction == directionBeforeChange && force == false) continue;
            else 
            {
                lines[i].right_node = this.connectTo[i].id + direction;
                lines[i].left_node = this.id + reverseDirection(direction);
            }
        }
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
    getCenter(): object {
        return {
            x: this.x + this.div.clientWidth/2,
            y: this.y + this.div.clientHeight/2
        }   
    }
    angleBetween(block: Block): number {
        const center1: any = this.getCenter();
        const center2: any = block.getCenter();

        const angleRad = Math.atan2(center2.y - center1.y, center2.x - center1.x);
        let angleDegree = (180 * angleRad) / Math.PI;

        if(angleDegree < 0)
            angleDegree += 360;

        return angleDegree;
    }

    getLines(): object[] {
        const lines = [];

        _lines.forEach((line: any) => {
            if(line.left_node_id == this.id) {
                lines.push(line);
            }
        });

        return lines;
    }
}
