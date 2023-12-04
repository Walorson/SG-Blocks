const workspace: HTMLElement = document.getElementById("workspace");

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
    
    execute(): void { setTimeout(() => { this.connectToExecute(); }, 500); }

    connect(): void { }

    connectToExecute(): void {
        executeHistory.push(this);
        for(let i=0; i<this.connectTo.length; i++)
        {
            if(executeHistory[executeHistory.length-2] == this.connectTo[i]) continue;
            this.connectTo[i].execute();
        }
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
}

class Start extends Block {
    constructor(x: number, y: number) {
        super(x, y);
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
}

class End extends Block {
    constructor(x: number, y: number) {
        super(x, y);
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block end" id="${this.id}">End</div>`;
    }

    execute(): void {
        console.warn("END");
    }
}

class Output extends Block {
    message: string;
    maxConnects: number = 2;
    constructor(x: number, y: number, message: string = "Hello World!") {
        super(x, y);
        this.message = message;
        this.init();
    }

    execute(): void {
        console.log(this.message);
        
        setTimeout(() => { this.connectToExecute() }, 500);
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block output" id="${this.id}">${this.message}</div>`;
    }
}

const blocksList = [];