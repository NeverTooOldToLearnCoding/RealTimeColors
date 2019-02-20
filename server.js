var session = require('express-session');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

const server = app.listen(8000, function() {
  console.log("listening on port 8000");
})
const io = require('socket.io')(server);

var color;

app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

// this is the line that tells our server to use the "/static" folder for static content
app.use(express.static(__dirname + "/static"));
// two underscores before dirname

// This sets the location where express will look for the ejs views
app.set('views', __dirname + '/views'); 
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');

app.get("/", function (request, response){



  io.on('connection', function (socket) { 
    socket.on('imconnected', function(data){
      socket.emit('updateAllClients', {color: color});
    });
    socket.on('green', function (data) { 
      // socket.emit will respond back to the socket client that triggered this 'alpha' listener
      color = "green";
      io.emit('updateAllClients', { color: "green" });
    });
    socket.on('red', function (data) { 
      // io.emit will message all socket clients
      color = "red"; 
      io.emit('updateAllClients', { color: "red" });
    });
    socket.on('pink', function (data) { 
      // socket.broadcast will message all socket clients except the one that triggered the 'gamma' listener
      color = "pink";
      io.emit('updateAllClients', { color: "pink" });
    });

  });

    response.render('index');
})






  // io.on('connection', function (socket) { 
    
  //   socket.on('alpha', function (data) { 
  //     // socket.emit will respond back to the socket client that triggered this 'alpha' listener
  //     socket.emit('updateClient', { data: 5 });
  //   });
  //   socket.on('beta', function (data) { 
  //     // io.emit will message all socket clients 
  //     io.emit('updateAllClients', { data: 5 });
  //   });
  //   socket.on('gamma', function (data) { 
  //     // socket.broadcast will message all socket clients except the one that triggered the 'gamma' listener
  //     socket.broadcast.emit('updateAllExceptOne', { data: 5 });
  //   });
  // });




// tell the express app to listen on port 8000, always put this at the end of your server.js file
