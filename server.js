#!/usr/bin/env node
var url = require("url");
var http = require("http");

var shoe = require('shoe');
var shux = require('shux')();
var path = require('path');

var express = require("express");
var uuid = require("uuid");
var browserify = require('browserify-middleware');

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var shellConnections = {};

function hasConnection(id){
    return shellConnections.hasOwnProperty(id);
}

function getConnection(id){
    return shellConnections[id];
}


var indexFile = path.join(__dirname, "static", "index.html");

var app = express();

app.use(express.logger());

app.use(app.router);

app.get("/", function(req, res){
    res.redirect("/session/" + uuid());
});

app.get("/session/:id", function(req, res){
    // If we already have that shell, redirect to a new one:
    if(hasConnection(req.params.id)){
        return res.redirect("/");
    }
    // Else, server up the console:
    res.status(200);
    res.sendfile(indexFile);
});

app.get("/viewer/:id", function(req, res){
    // If that shell doesn't exist, error:
    if(!hasConnection(req.params.id)){
        res.status(404);
        res.end("Not found :(");
        return;
    }

    res.status(200);
    res.sendfile(indexFile);
});

app.get("/shells", function(req, res){
    res.status(200);
    res.write("<html>");
    res.write("<head></head>")
    res.write("<body>")
    res.write("<p>Available shells:</p>");
    res.write("<ul>")
    shux.list().forEach(function(id){
        res.write('<li><a href="/viewer/' + id + '">' + id + '</a> | <a href="/destroy/' + id + '">destroy</a></li>');
    });
    res.end("</ul>");
});

app.get("/destroy/:id", function(req, res){
    shux.destroy(req.params.id);
    res.redirect("/shells");
});



app.get('/bundle.js', browserify(path.join(__dirname, "browser", "main.js")));


// Http:
var server = http.createServer();

var sock, sockHandler;

var shellConnections = {};

var PATH_REGEX = /^\/([^\/]+)\/([^\/]+)/;

sock = shoe(function (stream) {
    var pathname = url.parse(stream.headers.referer).pathname;
    var matches = pathname.match(PATH_REGEX);

    if(matches.length < 3){
        stream.end();
    }

    var shell;
    var shellType = stream.shellType = matches[1];
    var shellId = stream.shellId = matches[2];

    if(shellType === "session" && !hasConnection(shellId)){
        shell = shux.createShell({
            id: shellId,
            command: process.env.CMD,
            arguments: process.env.CMD_ARGS.split(" "),
            name: 'xterm-color'
        });

        shellConnections[shellId] = {
            shell: shell,
            viewers: []
        };

        // Clean up:
        stream.on("end", function(){
            var connection = getConnection(shellId);

            if(connection && connection.viewers.length){
                connection.viewers.forEach(function(viewer){
                    viewer.stream.end();
                });
            }

            shux.destroy(shellId);

            delete connection;
            delete shellConnections[shellId];
        });

        stream.pipe(shell).pipe(stream);

        return;
    }

    if(shellType === "viewer" && hasConnection(shellId)){
        var connection = getConnection(shellId);
        var viewer = {
            stream: stream
        };
        
        connection.viewers.push(viewer);

        stream.on("end", function(){
            var connection = getConnection(shellId);
            if(connection){
                var viewerIdx = connection.viewers.indexOf(viewer);
                if(!!~viewerIdx){
                    connection.viewers.remove(viewerIdx);
                }
            }
        });

        shell = shux.attach(connection.shell.id);

        stream.pipe(shell).pipe(stream);

        return;
    }

    if(shellType === "session"){
        stream.write("This shell somehow already exists. Please reload");
    }else{
        stream.write("No such shell");
    }

    stream.end();
});

var sockHandler = sock.listener({
    prefix: '/sock'
}).getHandler();

server.on('request', function(req, res){
    if(!sockHandler(req, res)){
        return app(req, res);
    }
});


server.listen(parseInt(process.env.PORT, 10), process.env.HOST);

