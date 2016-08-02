declare var require: any;
let _ = require('lodash');
import { Camera } from './camera';

let Promise: any;

export interface MapSettings {
    layers: number[][][];
    tileHeight: number;
    tileWidth: number;
    spriteSheet: any;
}

export class Map {
    // `layers` are ordered with bottom-most layer first
    layers: number[][][];
    colCount: number; // # of columns in each layer
    rowCount: number; // # of rows in each layer
    height: number; // in pixels
    width: number; // in pixels
    spriteSheet: any;
    spriteSheetSettings: any;
    tileWidth: number;
    tileHeight: number;

    isLoaded: Boolean;

    constructor(settings: MapSettings) {
        this.layers = settings.layers;
        this.colCount = settings.layers[0].length;
        this.rowCount = settings.layers[0][0].length;
        this.tileHeight = settings.tileHeight;
        this.tileWidth = settings.tileWidth;
        this.height = this.colCount * this.tileHeight;
        this.width = this.rowCount * this.tileWidth;
        this.spriteSheet = {
            settings: settings.spriteSheet
        };
        this.isLoaded = false;
        this.load();
    }

    load(): void {
        let img = new Image();
        img.onload = () => {
            this.isLoaded = true;
        };
        img.src = this.spriteSheet.settings.src;
        this.spriteSheet.image = img;

        _.each(_.range(1, this.spriteSheet.settings.imageCount + 1), key => {
            this.spriteSheet[key] = {
                x: (key - 1) * this.spriteSheet.settings.imageWidth,
                y: 0,
                width: this.spriteSheet.settings.imageWidth,
                height: this.spriteSheet.settings.imageHeight
            };

        })
    }
}