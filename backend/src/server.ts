import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from './app';
import { connectDatabase, disconnectDatabase } from './config/prisma';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:3000"],
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
    // Connect to Supabase/PostgreSQL via Prisma
    await connectDatabase();
  } catch (error) {
    console.error("⚠️  Database connection failed — server will start anyway:");
    console.error("   Error:", error instanceof Error ? error.message : error);
    console.error("   Fix: Check DATABASE_URL in backend/.env");
  }

  // Start server regardless of DB connection
  server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     🚀 QuickMart Backend Started      ║
║          Port: ${PORT}                  ║
║     Database: PostgreSQL (Supabase)   ║
║     Environment: ${process.env.NODE_ENV || 'development'}       ║
╚════════════════════════════════════════╝
    `);
  });
}

startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await disconnectDatabase();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
