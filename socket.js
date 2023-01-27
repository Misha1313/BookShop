let io;

module.exports = {
    init: httpServer => {
        const io = require('socket.io')(httpServer);
        return io;
    },
    getIo: () => {
        if(!io) {
            throw new Error('Socket.io not initialized!')
        }
        return io;
    }
}