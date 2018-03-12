var chokidar = require('chokidar')
var express = require('express')
var browserSync = require('browser-sync')
var app = express()
var watcher = chokidar.watch('./src')
var port = 3000


watcher.on('ready', function() {
  watcher.on('all', function() {
    console.log("Clearing /dist/ module cache from server")
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id]
    })
  })
})


console.log(`listening on port:${port}`)

app.use(express.static('src'))
app.listen(port, listening)

function listening() {
    browserSync({
        proxy: `localhost:${port}`,
        files: ['./src/**/*.{js,html,css}']
    })
}
