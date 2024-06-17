const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer(app);
const port = 3000;

const wss = new WebSocket.Server({ server });

const instruments = {}

app.use(express.static('public'));

function broadcastMessage(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(instruments));
        }
    });
}

wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
    ws.on('message', (message) => {
        console.log('Received message from client:', message);
    });
});

app.get('/updateInstruments', (req, res) => {
    console.log("update")
    instruments[req.query.id] = !instruments[req.query.id];
    broadcastMessage();
    res.json({ status: 'success', message: 'instruments updated' });
});

server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
