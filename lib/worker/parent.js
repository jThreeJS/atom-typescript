var messages = require('./messages');
var childprocess = require('child_process');
var exec = childprocess.exec;
var spawn = childprocess.spawn;
var child;
var currentListeners = {};
function startWorker() {
    try {
        child = spawn('node', [__dirname + '/workerProcess.js']);
        function processResponse(m) {
            try {
                var parsed = JSON.parse(m.toString());
            }
            catch (ex) {
                console.log('PARENT ERR: Non JSON data from child:', m);
            }
            if (!currentListeners[parsed.message] || !currentListeners[parsed.message][parsed.id]) {
                console.log('PARENT ERR: No one was listening:', parsed.message, parsed.data);
                return;
            }
            else {
                currentListeners[parsed.message][parsed.id](parsed.data);
                delete currentListeners[parsed.message][parsed.id];
            }
        }
        var bufferedResponseHandler = new messages.BufferedBySeperatorHandler(processResponse);
        child.stdout.on('data', function (m) {
            bufferedResponseHandler.handle(m);
        });
        child.stderr.on('data', function (err) {
            console.log("CHILD ERR:", err);
        });
        child.on('close', function (code) {
            console.log('ts worker exited with code:', code);
        });
    }
    catch (ex) {
        atom.notifications.addError("Failed to start a child TypeScript worker. Atom-TypeScript is disabled.");
        console.error('Failed to activate ts-worker:', ex);
    }
}
exports.startWorker = startWorker;
function stopWorker() {
    if (!child)
        return;
    try {
        child.kill('SIGTERM');
    }
    catch (ex) {
        console.error('failed to kill worker child');
    }
    child = null;
}
exports.stopWorker = stopWorker;
function createId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function query(message, data, callback) {
    var id = createId();
    if (!currentListeners[message])
        currentListeners[message] = {};
    currentListeners[message][id] = callback;
    child.stdin.write(JSON.stringify({ message: message, id: id, data: data }) + messages.BufferedBySeperatorHandler.seperator);
}
exports.echo = function (data, callback) { return query(messages.echo, data, callback); };