var express = require('express')
var browserSync = require('browser-sync')
var app = express()
var port = 3000

// var chokidar = require('chokidar')
// var watcher = chokidar.watch('./src')
// watcher.on('ready', function() {
//   watcher.on('all', function() {
//     console.log("Clearing /dist/ module cache from server")
//     Object.keys(require.cache).forEach(function(id) {
//       if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id]
//     })
//   })
// })



app.use(express.static('src'))
app.listen(port, listening)

function listening() {
    console.log(`listening on port:${port}`)
    browserSync({
        proxy: `localhost:${port}`,
        files: [
            './src/game.bundle.js',
            './src/**/*.{html,css}'
        ]
    })
}
