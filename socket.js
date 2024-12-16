import express from "express";
import http from "http";
import socketIo from "socket.io";
import mongoose from "mongoose";
import cron from "node-cron";
import moment from "moment";
import Session from "./models/Session";

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store user sockets in memory (use Redis for scaling)
const userSockets = {}; 

dotenv.config();
connectDb()

app.get('/', (req, res) => {
  res.send('Socket.IO Server Running');
});

io.on('connection', (socket) => {
  console.log('A user connected'); // remove this, used for manual testing

  const userId = socket.handshake.query.userId;
  userSockets[userId] = socket; 

  socket.on('disconnect', () => {
    console.log('User disconnected'); // remove this, used for manual testing
    delete userSockets[userId]; 
  });
});

const sendReminder = async () => {
  const now = moment();
  const reminderTime = moment().add(15, 'minutes'); 

  try {
    const upcomingSessions = await Session.find({
      startTime: { $gt: now.toDate(), $lt: reminderTime.toDate() },
      status: 'scheduled', 
    });

    upcomingSessions.forEach(session => {
      const userSocket = userSockets[session.userId]; 

      if (userSocket) {
        userSocket.emit('sessionReminder', {
          message: `Your session "${session.name}" is starting soon at ${moment(session.startTime).format('h:mm A')}.`,
          sessionId: session._id,
        });
      }
    });
  } catch (err) {
    console.error('Error while sending reminders:', err);
  }
};

// calls function every 5 minutes
cron.schedule('*/5 * * * *', () => {
  sendReminder(); 
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
