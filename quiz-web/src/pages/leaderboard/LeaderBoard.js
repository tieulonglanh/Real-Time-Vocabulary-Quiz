import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const userId = 'tieulonglanh' + Math.floor(Math.random()*100);

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [socket, setSocket] = useState([]);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_WEBSOCKET_HOST);

    newSocket.emit("joinQuiz", { quizId: "quiz12345", userId: userId });

    newSocket.on("userJoined", (data) => {
      setLeaderboard(data);
      console.log(data);
    });

    newSocket.on('updateLeaderboard', (data) => {
      setLeaderboard(data);
    });

    setSocket(newSocket);
  }, []);

  const submitAnswer = () => {
    if (socket) {
      console.log("submitAnswer");
      socket.emit('submitAnswer', {
        quizId: 'quiz12345',
        userId: userId,
        score: Math.floor(Math.random() * 100), // Replace with actual score logic
      });
    }
  };
  return (
    <div>
      <h2>Leaderboard</h2>
      <button onClick={submitAnswer}>Update My Score</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        {leaderboard.map((data, index) => (
          <tbody key={data.id}>
            <tr>
              <td>{index + 1}</td>
              <td>{data.id}</td>
              <td>{data.score}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default Leaderboard;