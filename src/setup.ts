import { Camera } from './camera';
import { Keyboard } from './keyboard';
import { Character } from './character';

export function camera(map, settings) {
    if (settings) {
        return new Camera(map, settings);
    } else {
        // creates a camera the same size as the map
        let defaultCameraSettings = {
            height: map.height,
            width: map.width,
            speed: 0 // camera will not move
        };
        return new Camera(map, defaultCameraSettings);
    };
}

export function keyboard(settings) {
    if (settings) {
        return new Keyboard(settings);
    } else {
        return new Keyboard();
    }
}

export function character(map, camera, settings) {
    if (settings) {
        this.character = new Character(this.map, this.camera, settings.character);
        // reset the camera position in case the character has a different
        // startX and/or startY
        this.camera.x = Math.max(0, Math.min(this.character.x - this.character.centerPosition.x, this.camera.maxX));
        this.camera.y = Math.max(0, Math.min(this.character.y - this.character.centerPosition.y, this.camera.maxY));

        this.character.is = this.characterScreenPosition;
    }
}