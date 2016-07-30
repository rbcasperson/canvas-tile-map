declare var require: any;
let _ = require('lodash');
import { Camera } from './camera';

export interface MapSettings {
    layers: number[][][];
    tileHeight: number;
    tileWidth: number;
    imageSources: string[];
}

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

    constructor(settings: MapSettings) {
        this.layers = settings.layers;
        this.colCount = settings.layers[0].length;
        this.rowCount = settings.layers[0][0].length;
        this.tileHeight = settings.tileHeight;
        this.tileWidth = settings.tileWidth;
        this.height = this.colCount * this.tileHeight;
        this.width = this.rowCount * this.tileWidth;
        this.imageSources = settings.imageSources;
        this.images = [];
        this.setImages();
    }

    setImages(): void {
        _.each(_.range(this.layers.length), layer => {
            this.images.push({});
            _.each(_.range(this.colCount), row => {
                _.each(_.range(this.rowCount), col => {
                    let index: number = this.layers[layer][row][col];
                    if (this.imageSources[index]) {
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
}