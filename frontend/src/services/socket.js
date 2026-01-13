import io from 'socket.io-client';

// Connect to Backend URL
const socket = io.connect('http://localhost:5000');

export default socket;