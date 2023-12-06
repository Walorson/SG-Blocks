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
        this.properties();
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
            for(let i=0; i<this.connectTo.length; i++)
            {
                if(executeHistory[executeHistory.length-2] == this.connectTo[i]) continue;
                this.connectTo[i].execute();
            }

        }, RUN_SPEED);
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

    properties(): void {
        
    }
}

class StartBlock extends Block {
    constructor(x: number, y: number) {
        super(x, y);
        this.init();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block start" id="${this.id}">Start</div>`;
    }
}

class EndBlock extends Block {
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

class OutputBlock extends Block {
    message: string;
    isVariable: boolean;
    maxConnects: number = 2;

    constructor(x: number, y: number, message: string = "Hello World!", isVariable: boolean = false) {
        super(x, y);
        this.message = message;
        this.isVariable = isVariable;
        this.init();
    }

    execute(): void {
        if(this.isVariable) {
            console.log(globalVariables.get(this.message));
        }
        else {
            console.log(this.message);
        }
        
        this.connectToExecute();
    }

    createBlock(): void {
        if(this.isVariable) {
            workspace.innerHTML += `<div class="block output" id="${this.id}">Print: ${this.message}</div>`;
        }
        else {
            workspace.innerHTML += `<div class="block output" id="${this.id}">${this.message}</div>`;
        }
    }

    properties(): void {
        this.div.addEventListener("mousedown",() => {
            properties.innerHTML = `
                <p>Message: <input type="text" value="${this.message}" class="property${this.id}"></p>
            `;

            const property: any = properties.querySelectorAll(".property"+this.id);

            property[0].oninput = () => {
                this.message = property[0].value;
                this.div.textContent = this.message;
            };
        });
    }
}

class InputBlock extends Block {
    message: string;
    variableName: string;
    maxConnects: number = 2;

    constructor(x: number, y: number, variableName: any, message: string = "Enter variable") {
        super(x, y);
        this.message = message;
        this.variableName = variableName;

        globalVariables.set(this.variableName, null);
        this.init();
    }

    execute(): void {
        const variable: any = prompt(this.message);
        globalVariables.set(this.variableName, variable);

        this.connectToExecute();
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block input" id="${this.id}">Input: <b>${this.variableName}</b></div>`;
    }
}

class ConditionBlock extends Block {
    value1: any;
    value2: any;
    operator: string;
    maxConnects: number = 3;
    isValue1Variable: boolean;
    isValue2Variable: boolean;
    value1Name: string;
    value2Name: string;
    constructor(x: number, y: number, value1: any = 0, value2: any = 0, operator: string = "==", isValue1Variable: boolean = false, isValue2Variable: boolean = false) {
        super(x, y);
        this.value1 = value1;
        this.value2 = value2;
        this.operator = operator;
        this.isValue1Variable = isValue1Variable;
        this.isValue2Variable = isValue2Variable;

        if(this.isValue1Variable) this.value1Name = this.value1;
        if(this.isValue2Variable) this.value2Name = this.value2;

        this.init()
    }

    connectToExecute(): void {
        setTimeout(() => 
        {
            executeHistory.push(this);

            if(this.isValue1Variable == true) this.value1 = globalVariables.get(this.value1Name);
            if(this.isValue2Variable == true) this.value2 = globalVariables.get(this.value2Name);

            if(this.connectTo[0] == undefined || this.connectTo[1] == undefined) return;
            
            switch(this.operator)
            {
                case "==":
                    if(this.value1 == this.value2) this.connectTo[1].execute();
                    else if(this.connectTo[2] != undefined) this.connectTo[2].execute();
                break;
            }


        }, RUN_SPEED);
    }

    createBlock(): void {
        workspace.innerHTML += `<div class="block condition" id="${this.id}">IF</div>`;
    }
}

const blocksList = [];