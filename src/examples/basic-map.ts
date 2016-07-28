import { Game } from '../game';

var settings = {
    canvasID: 'basic-map',
    map: {
        layers: [
            [
                [1, 1, 1, 1, 1, 2, 2, 1, 1, 1],
                [1, 3, 1, 1, 1, 2, 2, 2, 2, 1],
                [1, 3, 3, 1, 1, 1, 1, 1, 2, 1],
                [1, 3, 3, 1, 3, 1, 1, 1, 2, 1],
                [1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
                [1, 1, 1, 2, 3, 1, 1, 1, 1, 1],
                [1, 1, 1, 2, 3, 1, 1, 1, 1, 1],
                [1, 1, 1, 2, 2, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 2, 1, 1, 1, 1, 1]
            ]
        ],
        tileHeight: 50,
        tileWidth: 50,
        imageSources: [
            null, // 0
            './static/images/grass.jpg', // 1
            './static/images/stone-path.jpg', // 2
            './static/images/sand.jpg'// 3
        ]
    }
}

let game = new Game(settings);
game.draw();
