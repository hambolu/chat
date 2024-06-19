import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from './firebase';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const API_URL = 'https://demo.reposebay.com/api/v1/chat';
  const recipientId = 644; // Replace with actual recipient ID
  const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYWZiMzI0ZmJhNDM5OTRhZDg1YjU4MmY5NmEzMDEyN2Q4ZDIzYTI5NWI5NzkzYjY2N2JhNjEwZTFiNzk3OGY2ZTY2MjAzYzUzZGQ2Y2ZiMmMiLCJpYXQiOjE3MTgwMzMzMTAuOTA2Mjc3ODk0OTczNzU0ODgyODEyNSwibmJmIjoxNzE4MDMzMzEwLjkwNjI3OTA4NzA2NjY1MDM5MDYyNSwiZXhwIjoxNzQ5NTY5MzEwLjkwNDc5NzA3NzE3ODk1NTA3ODEyNSwic3ViIjoiOTAwIiwic2NvcGVzIjpbXX0.5RiqO5pxAlYASuJFvgkq38Y5l2Q8Wb01aV26Eb4Gt0zEq_ZDmBen8mHFOOmsoI8UoWZyYmswqPVUO7Uza08tU7Hk3rs7FTDv9AuEsUfJ5ADiVOXI2qf_YCxlxLfUwaJxeoHFda8vWwt3FZZEoKyzK45Ir8A-eBgMPk_VuszP-3zpRQX7grNrkE4CTTziqsIfOtgNIqYV0UI1Xm1EX0bl8512v3IRr_wIZjg8hM84mDM4ccsEtSRvNj0RFYM_weY63LEhgTHNM97YDQDrzWjlP13Q1QvdpGSMtRtCpwHfopBlhk_fDjXNEFp0XKDz375IrTmv-bpqMP8j-WZhmcZybCZQ-8opQ8sh-ULVXDX3Pp8QOuCHcUHxbbwXPrPxI8MEHDyGjP5u7as2Amr6Gw20yTqHJK7FIoHCSyPanLHS3LtV2gL3YOHoGnkPTpcc8DlgtB-BK7bSlwNBaAWtYdnUnP0ZNjDFqbg_wApTG4A40BEJ8JSFEGTk-hPt21cQ_axusDNHj87YDfjXSdxkC1J4HrqItJ03mE-H1VIGROi0UmxVzwk-PmOIKKpoSZiOIOuOwUUCxEZFDuKjGzIln_DaJ51CttroK8bRpOj0bCi7ni7GCTSU97QNwyUSqPptLmaeDG6_1pEP3W48LNNeSyXfsHsT4tV8InXLPuK_9Bh178A'; // Replace with your actual token

  // Define fetchMessages outside useEffect
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/direct-messages/${recipientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error('Expected array but got', data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // Request permission for notifications
    const requestPermission = async () => {
      try {
        await Notification.requestPermission();
        const token = await getToken(messaging, { vapidKey: 'BKUNtcVN0uxVMdOnhHtHRN6XAwzcYRWtylBL7hghuJLiA0mNC' });
        console.log('FCM Token:', token);
        // Send token to server to save it for the user
      } catch (err) {
        console.error('Error getting FCM token:', err);
      }
    };

    requestPermission();

    // Listen for messages
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      setMessages(prevMessages => [...prevMessages, payload.data]);
    });

    fetchMessages();
  }, [recipientId, authToken]);

  const submit = async e => {
    e.preventDefault();

    const payload = {
      recipient_id: recipientId,
      content: message,
    };

    try {
      await fetch(`${API_URL}/direct-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
        <a href="/" className="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
          <span className="fs-5 fw-semibold">List group</span>
        </a>
        <div className="list-group list-group-flush border-bottom scrollarea">
          {messages.map((message, index) => (
            <div key={index} className="list-group-item py-3 lh-sm">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">User 1</strong>
                <small>Wed</small>
              </div>
              <div className="col-10 mb-1 small">{message.content}</div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={submit}>
        <input
          className="form-control"
          placeholder="Write message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
