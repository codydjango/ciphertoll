var express = require('express');
var app = express();
var port = 3000;

app.use(express.static('src'));
app.listen(port, listening);

function listening() {
  console.log(`listening on port:${port}`);
}
