'use strict';
/* global Map */
var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');

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
app.post('/files/:name', function(req, res) {
    state.files.set(req.params.name, req.body);
    res.status(204).send();
});
app.get('/files/:name', function(req, res) {
    res.send(state.files.get(req.params.name));
});

app.listen(cfg.port, function () {
  util.log('demo app listening at http://localhost:' + cfg.port);
});
