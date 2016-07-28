declare var require: any;
let _ = require('lodash');
import { Camera, CameraSettings } from './camera';
import { Map, MapSettings } from './map';

interface GameSettings {
    canvasID: string;
    map: MapSettings;
    camera?: CameraSettings;
}

export class Game {
    map: Map;
    camera: Camera;
    canvas: any;
    context: any;

    constructor(settings: GameSettings) {
        this.map = new Map(settings.map);
        if (settings.camera) {
            this.camera = new Camera(this.map, settings.camera);
        } else {
            let defaultCameraSettings = {
                height: this.map.height,
                width: this.map.width
            };
            this.camera = new Camera(this.map, defaultCameraSettings);
        };
        this.canvas = document.getElementById(settings.canvasID);
        this.canvas.height = this.camera.height;
        this.canvas.width = this.camera.width;
        this.context = this.canvas.getContext('2d');
    }

    get tilesInView() {
        var startCol = Math.floor(this.camera.x / this.map.tileWidth);
        var endCol = startCol + (this.camera.width / this.map.tileWidth);
        var startRow = Math.floor(this.camera.y / this.map.tileHeight);
        var endRow = startRow + (this.camera.height / this.map.tileHeight);
        return {
            startCol: startCol, 
            endCol: endCol, 
            startRow: startRow, 
            endRow: endRow
        };
    }

    drawLayer(layer, offsetX, offsetY): void {   
        let context = this.context; 
        _.each(_.range(this.map.colCount), row => {
            _.each(_.range(this.map.rowCount), col => {
                let img = this.map.images[layer][`${row} ${col}`];
                if (img) {
                    let x = (col * this.map.tileWidth) + offsetX;
                    let y = (row * this.map.tileHeight) + offsetY;
                    img.onload = function() {
                        context.drawImage(img, x, y, this.map.tileHeight, this.map.tileWidth);
                    }.bind(this);
                };
            })
        })
    }

    drawView(): void {
        let offsetX = -this.camera.x + (this.tilesInView.startCol * this.map.tileWidth);
        let offsetY = -this.camera.y + (this.tilesInView.startRow * this.map.tileHeight);
        console.log(offsetX, offsetY);
        _.each(_.range(this.map.layers.length), layer => {
            this.drawLayer(layer, offsetX, offsetY);
        });
    }

    clearView(): void {
        this.context.clearRect(0, 0, this.map.width, this.map.height);
    }

    update() {
        this.clearView();
        this.camera.x = 5;
        this.drawView();
    }
}