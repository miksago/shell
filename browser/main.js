var reconnect = require('reconnect/shoe');
var terminal = require('./index');

var container = document.getElementById("console");

// var stream = shoe('/sock');
// stream.on('end', function () {
//     window.close();
// });

var term = terminal(80, 25);
reconnect(function (stream) {
  term.pipe(stream).pipe(term);
}).connect('/sock');

term.appendTo(container);
term.listenTo(document);


function resize () {
  term.resize(container.offsetWidth, container.offsetHeight);
}
resize();
window.addEventListener('resize', resize);
