var express = require('express')
var browserSync = require('browser-sync')
var app = express()
var port = 3000

app.listen(port, listening)

function listening() {
    console.log(`listening on localhost:${port}`)
}
