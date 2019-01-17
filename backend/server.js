const express = require('express');
const app = express();
const chokidar = require('chokidar')
const path = require('path');
const watcher = chokidar.watch('.')
const port = 3000;
const router = express.Router()
const bodyParser = require('body-parser')


// console.log(path.join(__dirname))
// watcher.on('ready', function() {
//     console.log('watcher is ready')
//     watcher.on('all', function() {
//         Object.keys(require.cache).forEach(function(id) {
//             if (id.startsWith(path.join(__dirname))) {
//             // if (/[\/\\]backend[\/\\]/.test(id)) {
//                 delete require.cache[id]
//             }
//         })
//     })
// })


router.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(router);
app.use(bodyParser.json())
app.listen(port, listening);

function helloController(req, res) {
	res.json({ payload: 'world' })
}

function listening() {
  console.log(`API listening on localhost:${port}`);
}
