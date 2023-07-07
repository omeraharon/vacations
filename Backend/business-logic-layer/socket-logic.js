const io = require("socket.io");

let socketsManager;

function start(listener) {
    socketsManager = io(listener, {cors: {
        origin: "http://localhost:3000",
    }});
    
    socketsManager.sockets.on("connection", socket => {
    
        socket.on("add-active-from-client", vacation => {
            socketsManager.sockets.emit("add-active-from-server", vacation);
        });
        socket.on("update-active-from-client", vacation => {
            socketsManager.sockets.emit("update-active-from-server", vacation);
        });
        socket.on("delete-active-from-client", uuid => {
            socketsManager.sockets.emit("delete-active-from-server", uuid);
        });
    });
}

module.exports = {
    start
}