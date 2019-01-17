var express = require('express');
var app = express();
var port = 3000;

app.listen(port, listening);

function listening() {
  console.log(`API listening on localhost:${port}`);
}
