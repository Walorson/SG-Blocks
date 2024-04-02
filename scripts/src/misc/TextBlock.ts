class TextBlock extends Block
{
    text: string = "text";
    textHTML: string = "text";
    maxConnects: number = 0;
    constructor(x: number = 0, y: number = 0)
    {
        super(x,y);

        this.init();
    }

    createBlock(): void 
    {
        workspace.innerHTML += `<div class="block text" id="${this.id}">Sample Text</div>`;
    }

    updateDiv(): void {
        this.div.innerHTML = `<span>${this.textHTML}</span>`;
    }

    properties(): void {
    
        this.div.addEventListener("mousedown", () => {
            propertiesWindow.innerHTML = `
                <p>Message: <textarea class="property${this.id}">${this.text}</textarea></p>
            `;

            const property: any = propertiesWindow.querySelectorAll(".property"+this.id);

            property[0].oninput = () => {
                this.text = property[0].value;
                this.textHTML = this.newLineTransform(this.text);

                this.updateDiv();
            };  

            super.properties();
        });
    }

    newLineTransform(text: string): string {
        const indexArray: number[] = [];
        let index: number = text.indexOf("\n");
        let newText: string = "";

        while(index != -1) {
            indexArray.push(index);
            index = text.indexOf("\n", index + 1);
        }

        for(let i=0; i < indexArray.length; i++)
        {
            if(i == 0)
                newText += text.slice(0, indexArray[i]) + "<br>";
            else
                newText += text.slice(indexArray[i-1] + 1, indexArray[i]) + "<br>";
        }
        newText += text.slice(indexArray[indexArray.length-1] + 1, text.length);

        if(indexArray.length > 0)
             return newText;
        else return text;
    }
}