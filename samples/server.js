var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({
    dest: './tmp',
    putSingleFilesInArray: true
}));


app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/upload', function (req, res) {
    req.files.myfile.forEach(function(item) {
        console.log(item.originalname + " uploaded to " + item.path);
    });
    res.redirect("back");
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
