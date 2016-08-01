declare var require: any;
let _ = require('lodash');
import { Map } from './map';

export interface CameraSettings {
	width: number;
	height: number;
	speed: number; // in pixels per second
}

export class Camera {
	// all numbers are in pixels
	x: number;
	y: number;
	maxX: number;
	maxY: number;
	width: number;
	height: number;
	speed: number;

	constructor(map: Map, settings: CameraSettings) {
		this.width = settings.width;
		this.height = settings.height;
		this.x = 0;
		this.y = 0;
		this.maxX = map.width - this.width;
		this.maxY = map.height - this.height;
		this.speed = settings.speed;
	}

	move(delta, dirX, dirY) {
		console.log(dirX * this.speed * delta, dirY * this.speed * delta);
		this.x += dirX * this.speed * delta;
		this.y += dirY * this.speed * delta;
		// prevent looking beyond the map
		this.x = Math.max(0, Math.min(this.x, this.maxX));
    	this.y = Math.max(0, Math.min(this.y, this.maxY));
	}

}