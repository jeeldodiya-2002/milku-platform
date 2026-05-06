const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

let io;

const initSocket = async (server) => {
    const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", (socket) => {
        console.log(`🔌 New Connection: ${socket.id}`);
        
        socket.on("join_order", (orderId) => {
            socket.join(`order_${orderId}`);
            console.log(`👤 User joined tracking: order_${orderId}`);
        });

        socket.on("disconnect", () => {
            console.log("🔌 User Disconnected");
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};

module.exports = { initSocket, getIO };
