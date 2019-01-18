const express = require('express')
const app = express()
const port = 3000
const router = express.Router()
const bodyParser = require('body-parser')


router.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(router)
app.use(bodyParser.json())
app.listen(port, listening)

function listening() {
  console.log(`API listening on localhost:${port}`)
}
