import { Game } from '../game';

var settings = {
    canvasID: 'basic-map',
    map: {
        layers: [
            [
                [1, 1, 1, 1, 1, 2, 2, 1, 1, 1],
                [1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                [1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
                [1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 2, 2, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 2, 1, 1, 1, 1, 1]
            ]
        ],
        tileHeight: 50,
        tileWidth: 50,
        spriteSheet: {
            src: './static/images/tiles.png',
            imageCount: 5,
            imageWidth: 64,
            imageHeight: 64
        }
    }
}

let game = new Game(settings);
game.run();
