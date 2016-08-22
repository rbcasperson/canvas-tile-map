declare var require: any;
let _ = require('lodash');

import { Map } from './map';
import { Camera } from './camera';
import { CharacterScreenPosition } from './game';

export interface CharacterSettings {
    src: string;
    width: number;
    height: number;
    speed: number;
    startX?: number;
    startY?: number;
    layer?: number;
    collisionPoints?: number[][];
}

export class Character {
    x: number;
    y: number;
    maxX: number;
    maxY: number;
    screenX: number;
    screenY: number;
    speed: number;
    layer: number;
    isLoaded: Boolean;
    image: HTMLImageElement;
    is: CharacterScreenPosition;
    centerPosition: {
        x: number,
        y: number
    };
    collisionPoints: number[][];
    // the size of the character on the screen, not the size of the image
    width: number;
    height: number;

    constructor(map: Map, camera: Camera, settings: CharacterSettings) {
        this.x = settings.startX || 0;
        this.y = settings.startY || 0;
        this.width = settings.width;
        this.height = settings.height;
        this.maxX = map.width - this.width;
        this.maxY = map.height - this.height;
        this.speed = settings.speed;
        this.layer = settings.layer || 1;

        this.centerPosition = {
            x: (camera.width / 2) - (this.width / 2),
            y: (camera.height / 2) - (this.height / 2)
        }

        if (settings.collisionPoints) {
            this.collisionPoints = settings.collisionPoints;
        } else {
            this.setDefaultCollisionPoints(map);
        }

        this.isLoaded = false;
        this.load(settings.src);
    }

    setDefaultCollisionPoints(map: Map): void {
        // configure default points
        // should be each corner of the character, and if the size is bigger than
        // a map tile then points in between to prevent corners being on a clear
        // tile, but the center being on an impassable
        let points = [
            [0, 0],
            [0, this.height],
            [this.width, 0],
            [this.width, this.height]
        ];

        let horizontalSpaceBetweenPoints = this.width;
        while (horizontalSpaceBetweenPoints > map.tileWidth) {
            horizontalSpaceBetweenPoints /= 2;
            points.push(
                [horizontalSpaceBetweenPoints, 0],
                [horizontalSpaceBetweenPoints, this.height]);
        };
        let verticalSpaceBetweenPoints = this.height;
        while (verticalSpaceBetweenPoints > map.tileWidth) {
            verticalSpaceBetweenPoints /= 2;
            points.push(
                [0, verticalSpaceBetweenPoints],
                [this.width, verticalSpaceBetweenPoints]);
        };
        this.collisionPoints = points;
    }

    move(deltaTime: number, deltaX: number, deltaY: number): void {
        this.x += deltaX * this.speed * deltaTime;
		this.y += deltaY * this.speed * deltaTime;
        // prevent moving beyond the map
        if (this.x > this.maxX) {
            this.x = this.maxX;
        } else if (this.x < 0) {
            this.x = 0
        };
        if (this.y > this.maxY) {
            this.y = this.maxY;
        } else if (this.y < 0) {
            this.y = 0
        };
    }

    load(src: string): void {
        let img = new Image();
        img.onload = () => {
            this.isLoaded = true;
        };
        img.src = src;
        this.image = img;
    }
}