
const execSync = require('child_process').execSync;

var browserSync = require('browser-sync').create();

execSync('npm run all', { stdio: [0, 1, 2] });

browserSync.init({
    server: true,
    files: [
        'src/examples/basic-map.html',
        'src/examples/layered-map.html',
        'src/examples/large-map.html'
    ]
});

browserSync.watch('src/examples/**/*', (event) => {
    if (event === 'change') {
        execSync('npm run all', { stdio: [0, 1, 2] });
    }
});