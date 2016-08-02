declare var require: any;
let _ = require('lodash');

export interface CharacterSettings {
    src: string;
    width: number;
    height: number;
    startX?: number;
    startY?: number;
    layer?: number;
}

export class Character {
    x: number;
    y: number;
    layer: number;
    isLoaded: Boolean;
    image: HTMLImageElement;
    // the size of the character on the screen, not the size of the image
    width: number;
    height: number;

    constructor(settings: CharacterSettings) {
        this.x = settings.startX || 0;
        this.y = settings.startY || 0;
        this.width = settings.width;
        this.height = settings.height;
        this.layer = settings.layer || 1;

        this.isLoaded = false;
        this.load(settings.src);
    }

    move(deltaTime, deltaX, deltaY): void {
        
    }

    load(src): void {
        let img = new Image();
        img.onload = () => {
            this.isLoaded = true;
        };
        img.src = src;
        this.image = img;
    }
}