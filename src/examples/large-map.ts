import { Game } from '../game';

var layers = [
    [ // base layer
        [1, 1, 1, 1, 1, 2, 2, 1, 1, 1],
        [1, 3, 1, 1, 1, 2, 2, 2, 2, 1],
        [1, 3, 3, 1, 1, 1, 1, 1, 2, 1],
        [1, 3, 3, 1, 3, 1, 1, 1, 2, 1],
        [1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 2, 3, 1, 1, 1, 1, 1],
        [1, 1, 1, 2, 2, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 1]
    ],
    [ // a layer with some scattered bushes (4)
        [0, 4, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 4, 0, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
        [0, 5, 0, 0, 0, 0, 0, 0, 0, 5],
        [0, 0, 0, 0, 4, 5, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 5, 5, 0, 0],
        [0, 0, 0, 0, 0, 0, 5, 5, 0, 0],
    ]

];

var settings = {
    canvasID: 'large-map',
    map: {
        layers: layers,
        tileHeight: 50,
        tileWidth: 50,
        /*
        imageSources: [
            null, // 0
            './static/images/grass.jpg', // 1
            './static/images/stone-path.jpg', // 2
            './static/images/sand.jpg', // 3
            './static/images/bush.jpg' // 4
        ],
        */
        spriteSheet: {
            src: './static/images/tiles.png',
            imageCount: 5,
            imageWidth: 64,
            imageHeight: 64
        }
    },
    camera: {
        height: 300,
        width: 300,
        speed: 100
    },
    keyboard: {
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
    }
}

let game = new Game(settings);
game.map.load();
game.run()
