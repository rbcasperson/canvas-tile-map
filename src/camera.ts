declare var require: any;
let _ = require('lodash');

export class Camera {
	x: number;
	y: number;
	width: number; // in pixels
	height: number; // in pixels

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.x = 0;
		this.y = 0;
	}

}