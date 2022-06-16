import { createServer } from "http";
import { Server } from "socket.io";
import { SERVER } from './src/config/config.js';
import { SOCKET_EVENTS } from './src/config/constants.js';
import authMiddleware from './src/middlewares/auth.js';

const httpServer = createServer();
const io = new Server(httpServer);

io.use(authMiddleware);

io.on('connection', socket => {
    socket.join(socket.jwt.id);
    
    socket.on('newOrder', (order, acknowledge) => {
        io.to(order.receiver).emit('newOrder', { 
            from: socket.jwt.id, 
        });
        if (typeof acknowledge === "function") acknowledge();
    });

    // socket.on('messageReaded', (payload, acknowledge) => {
    //     io.to(payload.to).emit('messageReaded', {
    //         from: socket.jwt.id,
    //         message: payload.message
    //     });
    //     if (typeof acknowledge === "function") acknowledge();
    // });
});

httpServer.listen(SERVER.PORT);

console.log(`Listening on port ${SERVER.PORT}`);

