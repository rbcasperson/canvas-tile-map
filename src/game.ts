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
            this.character = new Character(settings.character)
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

    run(): void {
        this.map.load();

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
        }

        this.camera.move(deltaTime, deltaX, deltaY);
        this.clearView;
        this.drawView();
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

    drawCharacter() {
        let characterCenteredX = (this.camera.width / 2) - (this.character.width / 2);
        let characterCenteredY = (this.camera.height / 2) - (this.character.height / 2);
        let screenX = characterCenteredX // figure this out
        let screenY = characterCenteredY // figure this out
        this.context.drawImage(
            this.character.image,
            screenX,
            screenY,
            this.character.width,
            this.character.height
        );
    }

    drawView(): void {
        let offsetX = _.round(-this.camera.x + (this.tilesInView.startCol * this.map.tileWidth));
        let offsetY = _.round(-this.camera.y + (this.tilesInView.startRow * this.map.tileHeight));
        _.each(_.range(this.map.layers.length), layer => {
            if(this.character && layer === this.character.layer) {
                this.drawCharacter();
            };
            this.drawLayer(layer, offsetX, offsetY);
        });
    }

    clearView(): void {
        this.context.clearRect(0, 0, this.camera.width, this.camera.height);
    }
}