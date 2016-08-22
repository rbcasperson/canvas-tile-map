
const execSync = require('child_process').execSync;

var browserSync = require('browser-sync').create();

execSync('npm run all', { stdio: [0, 1, 2] });

browserSync.init({
    server: true,
    files: [
        'index.html'
    ]
});

browserSync.watch('src/*.ts', (event) => {
    if (event === 'change') {
        execSync('npm run all', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('src/examples/basic-map.ts', (event) => {
    if (event === 'change') {
        execSync('npm run basic', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('src/examples/layered-map.ts', (event) => {
    if (event === 'change') {
        execSync('npm run layered', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('src/examples/large-map.ts', (event) => {
    if (event === 'change') {
        execSync('npm run large', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('src/examples/character-map.ts', (event) => {
    if (event === 'change') {
        execSync('npm run character', { stdio: [0, 1, 2] });
    }
});