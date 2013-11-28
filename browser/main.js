var shoe = require('shoe');
var term = require('./index')(80, 25);

var container = document.getElementById("console");

var stream = shoe('/sock');
stream.on('end', function () {
    window.close();
});

term.pipe(stream).pipe(term);
term.appendTo(container);
term.listenTo(document);

function resize () {
  term.resize(container.offsetWidth, container.offsetHeight);
}
resize();
window.addEventListener('resize', resize);
