// setup of the map
var map = [
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

// settings
var tileSize = 50; //pixels

// set up canvas and context
var canvas = document.getElementById('canvas-map');
canvas.height = tileSize * map.length;
canvas.width = tileSize * map[0].length;
var context = canvas.getContext('2d');

// object to hold individual image elements for each tile
var images = {};

// store all the sources for the file based on the number in the map
var imageSources = {
    1: './images/grass.jpg',
    2: './images/stone-path.jpg',
    3: './images/sand.jpg'
};

// set the images object with a new image for each tile
for (var c = 0; c < map.length; c++) {
    for (var r = 0; r < map[0].length; r++) {
        var key = map[r][c];
        let img = new Image();
        img.src = imageSources[key];
        images[`${r} ${c}`] = img;
    }
}

// draw all the tiles
for (var c = 0; c < map.length; c++) {
    for (var r = 0; r < map[0].length; r++) {
        let img = images[`${r} ${c}`];
        let x = c * tileSize;
        let y = r * tileSize;
        
        img.onload = function() {
            context.drawImage(img, x, y, tileSize, tileSize);
        }
    }
}
