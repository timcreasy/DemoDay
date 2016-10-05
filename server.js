const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { connect } = require('./db/database.js');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Server running");
});

app.post('/api/users', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    res.json({msg: hash});
  });
});

io.on('connection', function (socket) {
  console.log("Socket connected");
  socket.emit('news', "Hello");
});

connect
  .then(() => {
    server.listen(3000, () => {
      console.log("Server listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("ERR", err);
  });
