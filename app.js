var util = require('util');
var twitter = require('twitter');

var twit = new twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.OAUTH_TOKEN,
  access_token_secret: process.env.OAUTH_TOKEN_SECRET
});

//var keyword = process.argv[2]; //第一引数
//var option = {'track': keyword};
//console.log(keyword+'を含むツイートを取得します。');

var fs = require('fs');
var app = require('http').createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(fs.readFileSync('index.html'));
}).listen(3000);

var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
  socket.on('msg', function(data) {
    io.sockets.emit('msg', data);
  });
});

//twit.stream('statuses/filter', option, function(stream) {
twit.stream('user', {}, function(stream) {
  stream.on('data', function (data) {
    io.sockets.emit('msg', data.text);
    //console.log(data);
  });
});
