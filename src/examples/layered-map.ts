import { Map } from '../map';

var layers = [
    [ // base layer
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
    ],
    [ // a layer with some scattered bushes (4)
        [0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 4, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 4, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 4, 0, 0],
    ]

];

var tileHeight = 50; //pixels
var tileWidth = 50; //pixels
var canvasID: string = 'layered-map';
var imageSources = [
    null, // 0
    './static/images/grass.jpg', // 1
    './static/images/stone-path.jpg', // 2
    './static/images/sand.jpg', // 3
    './static/images/bush.png' // 4
];

let map = new Map(canvasID, imageSources, layers, tileHeight, tileWidth);
map.draw();

