import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://node-chat-server-mnpw.onrender.com');

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('message', (msg) => {
            console.log('Received message:', msg); // Log the received message
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        socket.emit('message', message, (response) => {
            console.log('Server response:', response); // Log the server response
        });
        setMessage('');
    };

    return (
        <div>
            <h1>Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>Sender ID:</strong> {msg.sender_id} <br />
                        {msg.recipient_id && (
                            <>
                                <strong>Recipient ID:</strong> {msg.recipient_id} <br />
                            </>
                        )}
                        <strong>Content:</strong> {msg.content} <br />
                        <strong>Created At:</strong> {new Date(msg.created_at).toLocaleString()} <br />
                        <hr />
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
