import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

export default function SocketHandler(req: NextApiRequest, res: any) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join", (userId: string) => {
        socket.join(userId);
        console.log(`Socket: User ${userId} joined their personal room`);
      });

      socket.on("send-message", (message: any) => {
        const targetRoom = String(message.receiverId);
        console.log(`Socket: Broadcasting message to room: ${targetRoom}`);
        
        // Broadcast to the receiver's specific room
        io.to(targetRoom).emit("receive-message", message);
        
        // Optional: Also broadcast a generic notification event to everyone
        // to see if the client is at least receiving global events
        io.emit("new-transmission-global", { 
          receiverId: targetRoom, 
          senderName: message.senderName 
        });
      });
    });
  }
  res.end();
}
