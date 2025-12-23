// // import dotenv from "dotenv";
// import { Server as SocketIOServer, Socket } from "socket.io";
// import jwt from "jsonwebtoken";
// import { registerUserEvents } from "./userEvents.js";
// import { registerChatEvents } from "./chatEvents.js";
// import Conversation from "../modals/Conversation.js";

// // dotenv.config();

// export function initializedSocket(server: any): SocketIOServer {
//   const io = new SocketIOServer(server, {
//     cors: {
//       origin: "*", //allow all origins
//     },
//   }); // socket io server instance

//   //auth middleware
//   io.use((socket: Socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error("Authentication error: no token provided"));
//     }

//     jwt.verify(
//       token,
//       process.env.JWT_SECRET as string,
//       (err: any, decoded: any) => {
//         if (err) {
//           return next(new Error("Authentication error: Invalid token"));
//         }

//         //attach user data to socket
//         let userData = decoded.user;
//         socket.data.user = userData;
//         socket.data.userId = userData.id;
//         socket.data.name = userData.name || userData.username || "Unknown"; // ✅ Fixed: Added name
//         next();
//       }
//     );
//   });

//   //when socket connects, register events
//   io.on("connection", async (socket: Socket) => {
//     const userId = socket.data.userId;
//     const userName = socket.data;
//     console.log(`User connected: ${userId}, username: ${userName}`);

//     //register events
//     registerChatEvents(io, socket);
//     registerUserEvents(io, socket);

//     // join all the conversations the user is part of
//     try {
//       const conversations = await Conversation.find({
//         participants: userId,
//       }).select("_id");

//       conversations.forEach((conversation) => {
//         socket.join(conversation._id.toString());
//       });

//       console.log(`User ${userId} joined ${conversations.length} conversations`);
//     } catch (error: any) {
//       console.error("Error joining conversations:", error.message);
//     }

//     socket.on("disconnect", () => {
//       //user logs out
//       console.log(`User disconnected: ${userId}`);
//     });
//   });

//   return io;
// }

// import { Server as SocketIOServer, Socket } from "socket.io";
// import jwt from "jsonwebtoken";
// import Conversation from "../modals/Conversation.js";
// import { registerChatEvents } from "./chatEvents.js";
// import { registerUserEvents } from "./userEvents.js";

// export function initializedSocket(server: any): SocketIOServer {
//   const io = new SocketIOServer(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.use((socket: Socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error("Authentication error: no token provided"));
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
//       socket.data.user = decoded.user;
//       socket.data.userId = decoded.user.id;
//       socket.data.name = decoded.user.name || decoded.user.username || "Unknown";
//       next();
//     } catch (err: any) {
//       return next(new Error("Authentication error: Invalid token"));
//     }
//   });

//   io.on("connection", (socket: Socket) => {
//     const userId = socket.data.userId;
//     const userName = socket.data;
//     console.log("User connected - ID:", userId, "Name:", userName);

//     // Register events
//     registerChatEvents(io, socket);
//     registerUserEvents(io, socket);

//     // Join conversations
//     Conversation.find({
//       participants: userId,
//     })
//       .select("_id")
//       .then((conversations) => {
//         conversations.forEach((conversation) => {
//           socket.join(conversation._id.toString());
//         });
//         console.log(`User ${userId} joined ${conversations.length} conversations`);
//       })
//       .catch((err) => {
//         console.error("Error joining conversations:", err.message);
//       });

//     socket.on("disconnect", () => {
//       console.log("User disconnected - ID:", userId);
//     });
//   });

//   return io;
// }

import dotenv from "dotenv";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { registerUserEvents } from "./userEvents.js";
import { registerChatEvents } from "./chatEvents.js";
import Conversation from "../modals/Conversation.js";

dotenv.config();

export function initializedSocket(server: any): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", //allow all rigins
    },
  }); // socket io server instance

  //auth middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: no token provided"));
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          return next(new Error("Authentication error: Invalid token"));
        }

        //attach user data to socket
        let userData = decoded.user;
        socket.data = userData;
        socket.data.userId = userData.id;
        next();
      }
    );
  });

  //when socket connects, register events
  io.on("connection", async (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}, username: ${socket.data.name}`);

    //register events
    registerChatEvents(io, socket);
    registerUserEvents(io, socket);

    // join all the coversations the user is part of

    try {
      const conversations = await Conversation.find({
        participants: userId,
      }).select("_id");

      conversations.forEach((conversation) => {
        socket.join(conversation._id.toString());
      });
    } catch (error: any) {
      console.log("Error joining conversations: ", error);
    }

    socket.on("disconect", () => {
      //user logs out
      console.log(`user disconnected: ${userId} `);
    });
  });

  return io;
}





