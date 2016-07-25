import { Map } from '../map';

var tiles = [
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
];

var tileSize = 50; //pixels
var canvasID: string = 'basic-map';
var imageSources = {
    1: './static/images/grass.jpg',
    2: './static/images/stone-path.jpg',
    3: './static/images/sand.jpg'
};

let map = new Map(canvasID, imageSources, tiles, tileSize);
map.draw();

