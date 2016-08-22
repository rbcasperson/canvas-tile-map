import { Camera } from './camera';
import { Map } from './map';
import { Keyboard, KeyboardSettings } from './keyboard';
import { Character } from './character';

export function camera(map: Map, settings): Camera {
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

export function keyboard(settings): Keyboard {
    if (settings) {
        return new Keyboard(settings);
    } else {
        return new Keyboard();
    }
}
