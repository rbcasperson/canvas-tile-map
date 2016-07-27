declare var require: any;
let _ = require('lodash');
import { Camera } from './camera';

export class Map {
    // `layers` are ordered with bottom-most layer first
    layers: number[][][];
    colCount: number; // # of columns in each layer
    rowCount: number; // # of rows in each layer
    height: number; // in pixels
    width: number; // in pixels
    images: {[key: number]: HTMLImageElement}[];
    // `imageSources` are a list of sources (src) to put inside <img> elements
    // when creating a layer of tiles, each tile should reference the index of 
    // its corresponding source in the imageSources list.
    imageSources: string[]
    tileWidth: number;
    tileHeight: number;
    camera: Camera;
    canvas: any;
    context: any

    constructor(canvasID: string, imageSources: string[], layers: number[][][], tileHeight: number, tileWidth: number, camera?: Camera) {
        this.layers = layers;
        this.colCount = layers[0].length;
        this.rowCount = layers[0][0].length;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWidth;
        this.height = this.colCount * this.tileHeight;
        this.width = this.rowCount * this.tileWidth;
        if (camera) {
            this.camera = camera;
        } else {
            this.camera = new Camera(this.height, this.width); 
        }
        this.canvas = document.getElementById(canvasID);
        this.canvas.height = this.camera.height;
        this.canvas.width = this.camera.height;
        this.context = this.canvas.getContext('2d');
        this.imageSources = imageSources;
        this.images = [];
        this.setImages();
    }

    get tilesInView() {
        var startCol = Math.floor(this.camera.x / this.tileWidth);
        var endCol = startCol + (this.camera.width / this.tileWidth);
        var startRow = Math.floor(this.camera.y / this.tileHeight);
        var endRow = startRow + (this.camera.height / this.tileHeight);
        return {
            startCol: startCol, 
            endCol: endCol, 
            startRow: startRow, 
            endRow: endRow
        };
    }

    setImages(): void {
        _.each(_.range(this.layers.length), layer => {
            _.each(_.range(this.colCount), row => {
                _.each(_.range(this.rowCount), col => {
                    this.images.push({});
                    let index: number = this.layers[layer][row][col];
                    if (index !== 0) {
                        let img = new Image();
                        img.src = this.imageSources[index];
                        this.images[layer][`${row} ${col}`] = img;
                    } else {
                        this.images[layer][`${row} ${col}`] = null;
                    }
                });
            });
        });
    }

    drawLayer(layer, context = this.context): void {
        let offsetX = -this.camera.x + (this.tilesInView.startCol * this.tileWidth);
        let offsetY = -this.camera.y + (this.tilesInView.startRow * this.tileHeight);    
        _.each(_.range(this.colCount), row => {
            _.each(_.range(this.rowCount), col => {
                let img = this.images[layer][`${row} ${col}`];
                if (img) {
                    let x = (col * this.tileHeight) + offsetX;
                    let y = (row * this.tileWidth) + offsetY;
                    img.onload = function() {
                        context.drawImage(img, x, y, this.tileHeight, this.tileWidth);
                    }.bind(this);
                };
            })
        })
    }

    draw(context = this.context): void {
        _.each(_.range(this.layers.length), layer => {
            this.drawLayer(layer);
        });
    }
}