const express = require('express');
const app = express();
const chokidar = require('chokidar')

const watcher = chokidar.watch('./src')
const port = 3000;
const router = express.Router()


watcher.on('ready', function() {
  watcher.on('all', function() {
    console.log("Clearing /dist/ module cache from server")
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id]
    })
  })
})


router.get('/hello', helloController)
app.listen(port, listening);

function helloController(req, res) {
	res.json({ payload: 'world' })
}

function listening() {
  console.log(`API listening on localhost:${port}`);
}
