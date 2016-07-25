declare var require: any;
let _ = require('lodash');

export class Map {
    tiles: number[][];
    height: number;
    width: number;
    images: {
        [key: number]: HTMLImageElement
    };
    imageSources: {
        [key: number]: string
    };
    tileWidth: number;
    tileHeight: number;
    canvas: any;
    context: any

    constructor(canvasID: string, imageSources, tiles, tileHeight, tileWdith = tileHeight) {
        this.tiles = tiles;
        this.height = tiles.length;
        this.width = tiles[0].length;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWdith;
        this.canvas = document.getElementById(canvasID);
        this.canvas.height = this.height * this.tileHeight;
        this.canvas.width = this.width * this.tileWidth;
        this.context = this.canvas.getContext('2d');
        this.imageSources = imageSources;
        this.images = {};
        this.setImages();
    }

    setImages() {
        _.each(_.range(this.height), row => {
            _.each(_.range(this.width), col => {
                let key: number = this.tiles[row][col];
                let img = new Image();
                img.src = this.imageSources[key];
                this.images[`${row} ${col}`] = img;
            })
        })
    }

    draw(context = this.context): void {
        _.each(_.range(this.height), row => {
            _.each(_.range(this.width), col => {
                let img = this.images[`${row} ${col}`];
                let x = col * this.tileHeight;
                let y = row * this.tileWidth;
                img.onload = function() {
                    context.drawImage(img, x, y, this.tileHeight, this.tileWidth);
                }.bind(this);
            })
        })
    }

}