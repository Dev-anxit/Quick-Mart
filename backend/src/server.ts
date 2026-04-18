import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from './app';
import { connectMongoDB } from './config/mongodb';
import { initRedis } from './config/redis';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

// Socket.io namespace for orders
io.of("/orders").on("connection", (socket) => {
  console.log("User connected to /orders:", socket.id);

  socket.on("join_order_room", (orderId: string) => {
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined room: order_${orderId}`);
    socket.emit("room_joined", { orderId });
  });

  socket.on("leave_order_room", (orderId: string) => {
    socket.leave(`order_${orderId}`);
    console.log(`Socket ${socket.id} left room: order_${orderId}`);
  });

  // Admin: Update rider location (broadcasts to order room)
  socket.on("update_rider_location", ({ orderId, lat, lng, speed }: any) => {
    io.of("/orders")
      .to(`order_${orderId}`)
      .emit("rider_location_updated", {
        orderId,
        location: { lat, lng },
        speed,
        timestamp: new Date(),
      });
  });

  // Admin: Broadcast order status to specific order room
  socket.on("broadcast_order_status", ({ orderId, status, message }: any) => {
    io.of("/orders")
      .to(`order_${orderId}`)
      .emit("order_status_changed", {
        orderId,
        status,
        message,
        timestamp: new Date(),
      });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Store io instance globally for access in routes
(global as any).io = io;

// Initialize connections
async function startServer() {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Connect to Redis
    await initRedis();

    // Start server
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     🚀 E-Commerce Backend Started     ║
║          Port: ${PORT}                  ║
║     Environment: ${process.env.NODE_ENV}       ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
