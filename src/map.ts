declare var require: any;
let _ = require('lodash');
import { Camera } from './camera';

interface spriteSheetSettings {
    src: string;
    imageCount: number;
    imageHeight: number;
    imageWidth: number;
};

export interface MapSettings {
    layers: number[][][];
    tileHeight: number;
    tileWidth: number;
    spriteSheet: spriteSheetSettings;
    impassables?: number[];
}

export class Map {
    // `layers` are ordered with bottom-most layer first
    layers: number[][][];
    colCount: number; // # of columns in each layer
    rowCount: number; // # of rows in each layer
    height: number; // in pixels
    width: number; // in pixels
    spriteSheet: {
        settings: spriteSheetSettings;
        image: any;
        [tileID: number]: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    };
    tileWidth: number;
    tileHeight: number;
    impassables: number[];

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
            settings: settings.spriteSheet,
            image: undefined
        };
        this.impassables = settings.impassables;
        this.isLoaded = false;
        this.load();
    }

    tileAt(layer: number, x: number, y: number): number {
        let col = _.ceil(x / this.tileWidth) - 1;
        let row = _.ceil(y / this.tileHeight) - 1;
        // make sure col & row aren't negative
        col = _.max([0, col]);
        row = _.max([0, row]);
        return this.layers[layer][row][col];
    }

    load(): void {
        let img = new Image();
        img.onload = () => {
            this.isLoaded = true;
        };
        img.src = this.spriteSheet.settings.src;
        this.spriteSheet.image = img;
        // assign the information for each key
        _.each(_.range(1, this.spriteSheet.settings.imageCount + 1), (key: number) => {
            this.spriteSheet[key] = {
                x: (key - 1) * this.spriteSheet.settings.imageWidth,
                y: 0,
                width: this.spriteSheet.settings.imageWidth,
                height: this.spriteSheet.settings.imageHeight
            };
        })
    }
}