declare var require: any;
let _ = require('lodash');

export class Map {
    layers: number[][][];
    height: number;
    width: number;
    images: {[key: number]: HTMLImageElement}[];
    imageSources: {
        [key: number]: string
    };
    tileWidth: number;
    tileHeight: number;
    canvas: any;
    context: any

    constructor(canvasID: string, imageSources, layers, tileHeight, tileWdith = tileHeight) {
        this.layers = layers;
        this.height = layers[0].length;
        this.width = layers[0][0].length;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWdith;
        this.canvas = document.getElementById(canvasID);
        this.canvas.height = this.height * this.tileHeight;
        this.canvas.width = this.width * this.tileWidth;
        this.context = this.canvas.getContext('2d');
        this.imageSources = imageSources;
        this.images = [];
        this.setImages();
    }

    setImages(): void {
        _.each(_.range(this.layers.length), layer => {
            _.each(_.range(this.height), row => {
                _.each(_.range(this.width), col => {
                    let key: number = this.layers[layer][row][col];
                    let img = new Image();
                    img.src = this.imageSources[key];
                    this.images.push({});
                    this.images[layer][`${row} ${col}`] = img;
                });
            });
        });
    }

    drawLayer(layer, context = this.context): void {
        _.each(_.range(this.height), row => {
            _.each(_.range(this.width), col => {
                let img = this.images[layer][`${row} ${col}`];
                let x = col * this.tileHeight;
                let y = row * this.tileWidth;
                img.onload = function() {
                    context.drawImage(img, x, y, this.tileHeight, this.tileWidth);
                }.bind(this);
            })
        })
    }

    draw(context = this.context): void {
        _.each(_.range(this.layers.length), layer => {
            this.drawLayer(layer);
        });
    }
}