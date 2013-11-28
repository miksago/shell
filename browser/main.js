var shoe = require('shoe');
var reconnect = require('reconnect/inject');
var terminal = require('./index');

var container = document.getElementById("console");

// var stream = shoe('/sock');
// stream.on('end', function () {
//     window.close();
// });

var r = reconnect(function(args){
  return shoe.apply(null, arguments);
})

var session;
r({initialDelay: 1e3, maxDelay: 30e3}, function (stream) {
  session = terminal(80, 25)();
  session.appendTo(container);
  session.listenTo(document);
  resize();
  session.pipe(stream).pipe(session);
  session.on("end", function(){
    container.innerHTML = "";
  });

  stream.on("end", function(){
    container.innerHTML = "";
  });
}).connect('/sock');

function resize () {
  if(session){
    session.resize(container.offsetWidth, container.offsetHeight);
  }
}

window.addEventListener('resize', resize);
