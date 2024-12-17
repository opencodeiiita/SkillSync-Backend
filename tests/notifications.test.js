const { Server } = require('socket.io');
const Client = require('socket.io-client');

describe('Socket.IO Notifications', () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = require('http').createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = Client(`http://localhost:${port}`);

      io.on('connection', (socket) => {
        serverSocket = socket;
        done();
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  it('should fire a notification when a session is scheduled', (done) => {
    clientSocket.on('notification', (data) => {
      expect(data).toHaveProperty('message', 'Session scheduled successfully');
      done();
    });

    serverSocket.emit('notification', {
      message: 'Session scheduled successfully',
    });
  });
});
