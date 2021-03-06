//
// POST EXAMPLE
//
// { "branch_name":
// "gem_updates",
// "branch_url": "https://semaphoreci.com/projects/44/branches/50",
// "project_name": "base-app",
// "project_hash_id": "123-aga-471-6a8",
// "build_url": "https://semaphoreci.com/projects/44/branches/50/builds/15",
// "build_number": 15,
// "result": "passed",
// "event": "build",
// "started_at": "2012-07-09T15:23:53Z",
// "finished_at": "2012-07-09T15:30:16Z",
// "commit": { "id": "dc395381e650f3bac18457909880829fc20e34ba",
// "url": "https://github.com/renderedtext/base-app/commit/dc395381e650f3bac18457909880829fc20e34ba",
// "author_name": "Vladimir Saric",
// "author_email": "vladimir@renderedtext.com",
// "message": "Update 'shoulda' gem.",
// "timestamp": "2012-07-04T18:14:08Z"} }
//

var userAgentValid = process.env.SEMAPHORE_USER_AGENT;
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

server.listen(process.env.PORT || 5555);

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send("Get out here! https://github.com/djalmaaraujo/semaphore-watcher-server");
});

app.post('/hook', function (req, res) {
  var b = new Object(req.body);
  if (!b.hasOwnProperty('event') && (b.event !== "build")) return false;
  if (req.headers['user-agent'] !== userAgentValid) return false;

  io.sockets.emit("build", {
    project: b.project_hash_id
    , branch: b.branch_name
    , status: b.result
    , build_number: b.build_number
    , started_at: b.started_at
    , finished_at: b.finished_at
    , message: b.commit.message + ' - ' + b.commit.author_name
    , build_url: b.build_url
  });
});
