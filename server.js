const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

app.get('/', (req, res) => {
  res.send("Server running");
});

app.post('/', (req, res) => {
  console.log("I RECEIVED SOMETHING");
  console.log(req.body);
  res.json({msg: "hello"});
})/

io.on('connection', function (socket) {
  console.log("Socket connected");
  socket.emit('news', "Hello");
});