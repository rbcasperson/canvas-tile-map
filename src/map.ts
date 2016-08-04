declare var require: any;
let _ = require('lodash');
import { Camera } from './camera';

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
    collisions: number[];

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

    tileAt(x, y) {
        return [_.floor(x / this.tileWidth), _.floor(y / this.tileHeight)];
    }

    tilesApproaching(character, deltaX, deltaY) {
        let tiles = [];
        let points = [];
        if (deltaX = 1) { // moving right
            let topRight = [character.x + character.width + 1, character.y];
            let bottomRight = [character.x + character.width + 1, character.y + character.height];
            points.push(topRight, bottomRight);
        };
        if (deltaY = 1) { // moving down
            let bottomLeft = [character.x, character.y + character.height + 1];
            let bottomRight = [character.x + character.width, character.y + character.height + 1];
            points.push(bottomLeft, bottomRight);
        };
        if (deltaX === -1) { // moving left
            let topLeft = [character.x - 1, character.y];
            let bottomLeft = [character.x - 1, character.y + character.height];
            points.push(topLeft, bottomLeft);
        };
        if (deltaY === -1) { // moving up
            let topLeft = [character.x, character.y - 1];
            let topRight = [character.x + character.width, character.y -1];
        };
        _.map(points, point => {
            let [x, y] = point;
            tiles.push(this.tileAt(x, y));
        });
        return tiles;
    }

    hasCollisionAt(col, row): boolean {
        if (row < 0 || col < 0 || row >= this.rowCount || col >= this.colCount) {
            return false;
        }
        let collision = false;
        _.each(_.range(this.layers.length), layer => {
            if (_.includes(this.collisions, this.layers[layer][row][col])) {
                collision = true;
            };
        });
        return collision
        // use _.any() to maybe make this better
        // or an old for loop so I can break
    }
}