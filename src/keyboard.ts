declare var require: any;
let _ = require('lodash');

interface Key {
	code: number;
	action: string;
}

export interface KeyboardSettings {
	keys: any
}

let defaultKeyboardSettings = {
	keys: {
		LEFT: {
			code: 37,
			action: 'move -1 0'
		},
		RIGHT: {
			code: 39,
			action: 'move 1 0'
		},
		UP: {
			code: 38,
			action: 'move 0 -1'
		},
		DOWN: {
			code: 40,
			action: 'move 0 1'
		}
	}
};

export class Keyboard {
	keys: any

	constructor(settings: KeyboardSettings = defaultKeyboardSettings) {
		this.keys = settings.keys;
		this.listenForEvents();
	}

	get codes() {
		let codes = {};
		_.each(this.keys, (metadata, name) => {
			codes[this.keys[name].code] = name;
		});
		return codes
	}

	listenForEvents() {
		window.addEventListener('keydown', this._onKeyDown.bind(this));
	    window.addEventListener('keyup', this._onKeyUp.bind(this));
	    _.each(this.keys, (metadata, name) => {
	    	this.keys[name].isDown = false;
	    })
	}

	_onKeyDown(event) {
		let keyCode = event.keyCode;
		let codes = this.codes;
		if (this.codes[keyCode]) {
			event.preventDefault();
			this.keys[this.codes[keyCode]].isDown = true;
		};

	}

	_onKeyUp(event) {
		let keyCode = event.keyCode;
		if (this.codes[keyCode]) {
			event.preventDefault();
			this.keys[this.codes[keyCode]].isDown = false;
		};
	}
}