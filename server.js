const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { connect } = require('./db/database.js');
const User = require('./models/User');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Server running");
});

app.post('/api/users', (req, res) => {
  User
    .create({email: req.body.email, password: req.body.password})
    .then((user) => {
      res.json({user: user});
    })
    .catch((err) => {
      next(err);
    });
});

app.post('/api/login', (req, res) => {
  User
    .findOne({email: req.body.email})
    .then((user) => {
      if (!user) {
        res.json({msg: "Email is not registered"});
      } else {
        bcrypt.compare(req.body.password, user.password, (err, matches) => {
          if (err) {
            res.json({msg: "An unknown error occured, try again"});
          } else {
            if (!matches) {
              res.json({msg: "Incorrect password"});
            } else if (matches) {
              res.json({user: user});
            }
          }
        })
      }
    })
    .catch((err) => {
      res.json({msg: "An unknown error occured, try again"});
    })
});

connect
  .then(() => {
    server.listen(3000, () => {
      console.log("Server listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("An error occured:", err);
  });
