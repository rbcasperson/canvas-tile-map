import { Map } from '../map';

var layers = [
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
];

var tileSize = 50; //pixels
var canvasID: string = 'basic-map';
var imageSources = [
    null, // 0
    './static/images/grass.jpg', // 1
    './static/images/stone-path.jpg', // 2
    './static/images/sand.jpg'// 3
];

let map = new Map(canvasID, imageSources, layers, tileSize);
map.draw();

