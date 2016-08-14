declare var require: any;
let _ = require('lodash');
import { Camera, CameraSettings } from './camera';
import { Map, MapSettings } from './map';
import { Keyboard, KeyboardSettings } from './keyboard';
import { Character, CharacterSettings } from './character';

interface GameSettings {
    canvasID: string;
    map: MapSettings;
    camera?: CameraSettings;
    keyboard?: KeyboardSettings;
    character?: CharacterSettings;
}

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

        // set up the camera
        if (settings.camera) {
            this.camera = new Camera(this.map, settings.camera);
        } else {
            // creates a camera the same size as the map
            let defaultCameraSettings = {
                height: this.map.height,
                width: this.map.width,
                speed: 0 // camera will not move
            };
            this.camera = new Camera(this.map, defaultCameraSettings);
        };

        // set up the keyboard
        if (settings.keyboard) {
            this.keyboard = new Keyboard(settings.keyboard);
        } else {
            this.keyboard = new Keyboard();
        }

        // set up the character
        if (settings.character) {
            this.character = new Character(this.map, this.camera, settings.character);
            this.character.is = this.characterScreenPosition;
        }

        this.canvas = document.getElementById(settings.canvasID);
        this.canvas.height = this.camera.height;
        this.canvas.width = this.camera.width;
        this.context = this.canvas.getContext('2d');

        this.timeSinceLastUpdate = 0;
    }

    get tilesInView() {
        var startCol = _.floor(this.camera.x / this.map.tileWidth);
        var endCol = startCol + (this.camera.width / this.map.tileWidth);
        var startRow = _.floor(this.camera.y / this.map.tileHeight);
        var endRow = startRow + (this.camera.height / this.map.tileHeight);
        return {
            startCol: startCol, 
            endCol: _.min([endCol, this.map.colCount - 1]), 
            startRow: startRow, 
            endRow: _.min([endRow, this.map.rowCount - 1])
        };
    }

    get characterScreenPosition() {
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

    update(totalTime): void {
        window.requestAnimationFrame(this.update.bind(this));

        // compute deltaTime time in seconds
        let deltaTime = (totalTime - this.timeSinceLastUpdate) / 1000;
        deltaTime = _.min([deltaTime, .25]);
        this.timeSinceLastUpdate = totalTime;

        _.each(this.keyboard.keys, key => {
            if (key.isDown) {
                let [action, ...params] = key.action.split(' ');
                if (action == 'move') {
                    let [deltaX, deltaY] = _.map(params, _.toInteger);
                    this.move(deltaTime, deltaX, deltaY);
                }
            }
        })
    }

    move(deltaTime, deltaX, deltaY) {
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

    hasCollision() {
        let collision = false;
        _.each(this.character.collisionPoints, point => {
            let [x, y] = point;
            // find that collision point's currunt location on the canvas
            x += this.character.x;
            y += this.character.y;
            // check if it has a collision
            _.each(_.range(this.map.layers.length), layer => {
                if (_.includes(this.map.impassables, this.map.tileAt(layer, x, y))) {
                    collision = true;
                };
            });
        });
        return collision
    }

    drawCharacter() {
        // assume the character should be centered
        let screenX: number = this.character.centerPosition.x;
        let screenY: number = this.character.centerPosition.y;
        if (this.character.is.leftOfCenter) {
            screenX = this.character.x;
        };
        if (this.character.is.rightOfCenter) {
            // character's max screenX - character's distance from the map's right edge
            screenX = (this.camera.width - this.character.width) - (this.character.maxX - this.character.x);
        }
        if (this.character.is.upOfCenter) {
            screenY = this.character.y;
        }
        if (this.character.is.downOfCenter) {
            // character's max screenY - character's distance from the map's bottom edge
            screenY = (this.camera.height - this.character.height) - (this.character.maxY - this.character.y);
        }

        this.context.drawImage(
            this.character.image,
            screenX,
            screenY,
            this.character.width,
            this.character.height
        );
    }

    drawLayer(layer, offsetX, offsetY): void {
        let context = this.context;
        let tiles = this.tilesInView;
        _.each(_.range(tiles.startRow, tiles.endRow + 1), row => {
            _.each(_.range(tiles.startCol, tiles.endCol + 1), col => {
                let tile = this.map.layers[layer][row][col];
                if (tile !== 0) {
                    let source = this.map.spriteSheet[tile];
                    let destX = ((col - tiles.startCol) * this.map.tileWidth) + offsetX;
                    let destY = ((row - tiles.startRow) * this.map.tileHeight) + offsetY;
                    context.drawImage(
                        this.map.spriteSheet.image,
                        source.x,
                        source.y,
                        source.width,
                        source.height,
                        _.round(destX),
                        _.round(destY),
                        this.map.tileWidth,
                        this.map.tileHeight
                    )
                }
            })
        })
    }

    drawView(): void {
        let offsetX = _.round(-this.camera.x + (this.tilesInView.startCol * this.map.tileWidth));
        let offsetY = _.round(-this.camera.y + (this.tilesInView.startRow * this.map.tileHeight));
        _.each(_.range(this.map.layers.length), layer => {
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
