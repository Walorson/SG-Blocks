class Block {
    id: number;
    x: number;
    y: number;
    div: HTMLElement;
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
        document.body.innerHTML += `<div class="block" id="${this.id}"></div>`;
    }

    setPosition(x: number, y: number): void {
        this.div.style.top = y+"px";
        this.div.style.left = x+"px";
    }

    getID(): void {
        this.div = document.getElementById(this.id+"");
    }
    
    execute(): void {
        if(this.connectTo[0] != undefined) {
            this.connectTo[0].execute();
        }
    }

    connect(): void {
        
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
        document.body.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
}

class End extends Block {
    constructor(x: number, y: number) {
        super(x, y);
        this.init();
    }

    createBlock(): void {
        document.body.innerHTML += `<div class="block end" id="${this.id}">End</div>`;
    }
}

class Output extends Block {
    message: string;
    constructor(x: number, y: number, message: string = "Hello World!") {
        super(x, y);
        this.message = message;
        this.init();
    }

    execute(): void {
        console.log(this.message);
        
        if(this.connectTo[0] != undefined) {
            this.connectTo[0].execute();
        }
    }

    createBlock(): void {
        document.body.innerHTML += `<div class="block output" id="${this.id}">${this.message}</div>`;
    }
}

const blocksList = [];