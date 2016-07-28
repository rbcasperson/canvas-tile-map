declare var require: any;
let _ = require('lodash');
import { Map } from './map';

export class Camera {
	// all numbers are in pixels
	x: number;
	y: number;
	maxX: number;
	maxY: number;
	width: number;
	height: number;

	constructor(map: Map, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.x = 0;
		this.y = 0;
		this.maxX = map.width - this.width;
		this.maxY = map.height - this.height;
	}

	move(dirX, dirY) {
		this.x += dirX;
		this.y += dirY;
		// prevent looking beyond the map
		this.x = Math.max(0, Math.min(this.x, this.maxX));
    	this.y = Math.max(0, Math.min(this.y, this.maxY));
	}

}