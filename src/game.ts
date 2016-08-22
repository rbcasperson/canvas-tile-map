declare var require: any;
let _ = require('lodash');
import * as draw from './draw';
import * as setup from './setup';
import { Camera, CameraSettings } from './camera';
import { Map, MapSettings } from './map';
import { Keyboard, KeyboardSettings, Key } from './keyboard';
import { Character, CharacterSettings } from './character';

interface GameSettings {
    canvasID: string;
    map: MapSettings;
    camera?: CameraSettings;
    keyboard?: KeyboardSettings;
    character?: CharacterSettings;
}

export interface TilesInView {
    startCol: number; 
    endCol: number;
    startRow: number; 
    endRow: number;
};

export interface CharacterScreenPosition {
    centered: {
        horizontally: boolean;
        vertically: boolean;
    };
    leftOfCenter: boolean;
    rightOfCenter: boolean;
    upOfCenter: boolean;
    downOfCenter: boolean;
};

export class Game {
    map: Map;
    camera: Camera;
    keyboard: Keyboard;
    character: Character;
    canvas: any;
    context: any;
    timeSinceLastUpdate: number;

    constructor(settings: GameSettings) {
        this.map = new Map(settings.map);

        this.camera = setup.camera(this.map, settings.camera);
        this.keyboard = setup.keyboard(settings.keyboard);

        // set up the character
        if (settings.character) {
            this.character = new Character(this.map, this.camera, settings.character);
            // reset the camera position in case the character has a different
            // startX and/or startY
            this.camera.x = Math.max(0, Math.min(this.character.x - this.character.centerPosition.x, this.camera.maxX));
    	    this.camera.y = Math.max(0, Math.min(this.character.y - this.character.centerPosition.y, this.camera.maxY));

            this.character.is = this.characterScreenPosition;
        }

        this.canvas = document.getElementById(settings.canvasID);
        this.canvas.height = this.camera.height;
        this.canvas.width = this.camera.width;
        this.context = this.canvas.getContext('2d');

        this.timeSinceLastUpdate = 0;
    }

    get tilesInView(): TilesInView {
        var startCol: number = _.floor(this.camera.x / this.map.tileWidth);
        var endCol: number = startCol + (this.camera.width / this.map.tileWidth);
        var startRow: number = _.floor(this.camera.y / this.map.tileHeight);
        var endRow: number = startRow + (this.camera.height / this.map.tileHeight);
        return {
            startCol: startCol, 
            endCol: _.min([endCol, this.map.colCount - 1]), 
            startRow: startRow, 
            endRow: _.min([endRow, this.map.rowCount - 1])
        };
    }

    get characterScreenPosition(): CharacterScreenPosition {
        let isLeft = false;
        let isRight = false;
        let isUp = false;
        let isDown = false;
        if (this.character.x < this.character.centerPosition.x) {
            isLeft = true;
        }
        if (this.character.x > this.character.maxX - this.character.centerPosition.x) {
            isRight = true;
        }
        if (this.character.y < this.character.centerPosition.y) {
            isUp = true;
        }
        if (this.character.y > this.character.maxY - this.character.centerPosition.y) {
            isDown = true;
        }

        return {
            centered: {
                horizontally: !(isLeft || isRight) ,
                vertically: !(isUp || isDown)
            },
            leftOfCenter: isLeft,
            rightOfCenter: isRight,
            upOfCenter: isUp,
            downOfCenter: isDown
        };
    }

    run(): void {
        let timer = setInterval(() => {
            if (this.map.isLoaded) {
                this.drawView();
                window.requestAnimationFrame(this.update.bind(this));
                clearInterval(timer);
            };
        }, 10)
        
    }

    update(totalTime: number): void {
        window.requestAnimationFrame(this.update.bind(this));

        // compute deltaTime time in seconds
        let deltaTime = (totalTime - this.timeSinceLastUpdate) / 1000;
        deltaTime = _.min([deltaTime, .25]);
        this.timeSinceLastUpdate = totalTime;

        _.each(this.keyboard.keys, (key: Key) => {
            if (key.isDown) {
                let [action, ...params] = key.action.split(' ');
                if (action == 'move') {
                    let [deltaX, deltaY]: number[] = _.map(params, _.toInteger);
                    this.move(deltaTime, deltaX, deltaY);
                }
            }
        })
    }

    move(deltaTime: number, deltaX: number, deltaY: number): void {
        if (this.character) {
            this.character.move(deltaTime, deltaX, deltaY);

            // if the character is on an impassable tile, undo the move
            if (this.hasCollision()) {
                this.character.move(deltaTime, -deltaX, -deltaY);
                deltaX = 0;
                deltaY = 0;
            };


            this.character.is = this.characterScreenPosition;
            // figure out if the camera needs to move
            if (!this.character.is.centered.horizontally) {
                deltaX = 0;
            };
            if (!this.character.is.centered.vertically) {
                deltaY = 0;
            };
            this.camera.move(deltaTime, deltaX, deltaY);
        } else {
            this.camera.move(deltaTime, deltaX, deltaY);
        }

        this.clearView;
        this.drawView();
    }

    hasCollision(): boolean {
        let collision = false;
        _.each(this.character.collisionPoints, (point: number[]) => {
            let [x, y] = point;
            // find that collision point's currunt location on the canvas
            x += this.character.x;
            y += this.character.y;
            // check if it has a collision
            _.each(_.range(this.map.layers.length), (layer: number) => {
                if (_.includes(this.map.impassables, this.map.tileAt(layer, x, y))) {
                    collision = true;
                };
            });
        });
        return collision
    }

    drawCharacter(): void {
        draw.character(this.character, this.camera, this.context);
    }

    drawLayer(layer: number, offsetX: number, offsetY: number): void {
        draw.layer(this.context, this.tilesInView, this.map, layer, offsetX, offsetY);
    }

    drawView(): void {
        let offsetX: number = _.round(-this.camera.x + (this.tilesInView.startCol * this.map.tileWidth));
        let offsetY: number = _.round(-this.camera.y + (this.tilesInView.startRow * this.map.tileHeight));
        _.each(_.range(this.map.layers.length), (layer: number) => {
            // if it is the correct layer, draw the character
            if(this.character && layer === this.character.layer) {
                this.drawCharacter();
            };
            // draw the layer
            this.drawLayer(layer, offsetX, offsetY);
        });
        if(this.character && this.map.layers.length <= this.character.layer) {
            this.drawCharacter();
        };
    }

    clearView(): void {
        this.context.clearRect(0, 0, this.camera.width, this.camera.height);
    }
}
