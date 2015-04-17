'use strict';
/* global Map */
var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');
var multer = require('multer');

var cfg = {
    port: 3000
};
var app = express();
var state = {};

app.use(express.static('../app'));

state.files = new Map();
app.use(bodyParser.raw({
    type: 'application/octet-stream',
    limit: '1gb'
}));
app.use(multer({
    inMemory: true
}));
app.post('/multipart_files', function(req, res) {
    var name = Object.keys(req.files)[0];
    state.files.set(name, req.files[name].buffer);
    res.status(200).send('done');
});
app.post('/files/:name', function(req, res) {
    state.files.set(req.params.name, req.body);
    res.status(204).send();
});
app.get('/files/:name', function(req, res) {
    res.send(state.files.get(req.params.name));
});

app.listen(cfg.port, '0.0.0.0', function () {
  util.log('demo app listening at http://localhost:' + cfg.port);
});
