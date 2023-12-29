
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const getProficiencyLevel = (points) => {
  if (points < 100) {
    return 'Beginner';
  } else if (points >= 100 && points < 300) {
    return 'Intermediate';
  } else if (points >= 300 && points < 500) {
    return 'Advanced';
  } else {
    return 'Grandmaster';
  }
};

const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    Cookies.remove('bearerToken');
    navigate('/auth/login');
  };

  useEffect(() => {
    const token = Cookies.get('bearerToken');

    if (!token) {
      navigate('/auth/login');
      return;
    }

    fetch('http://127.0.0.1:8000/user_data', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setUserData(data.data[0]);
      } else {
        console.error('Invalid data structure or empty data array');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [navigate]);

  if (!userData) {
    return <p>Loading...</p>; // Or handle this as needed
  }

  const proficiencyLevel = getProficiencyLevel(userData.total_points);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 text-center mb-4">
        <div className="mb-4">
          <img
            src="profile_avtar.png"
            alt="Avatar"
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <span className="text-xl font-bold">{userData.username}</span>
          {userData.total_points && (
            <p>
              Total Points: <strong>{userData.total_points}</strong>
            </p>
          )}
          <p>
            <strong>{proficiencyLevel}</strong>
          </p>
        </div>
        <div className="text-left">
          <h2 className="text-lg font-semibold mt-6">Question History</h2>
          <div className="max-h-40 overflow-y-auto mt-4">
            {userData.questions && userData.questions.length > 0 ? (
              userData.questions.map((question, index) => (
                <div key={index} className="border-b border-gray-300 py-2">
                  <p>
                    Question: <strong>{question.question}</strong>
                  </p>
                  <p>
                    Answer: <strong>{question.answer}</strong>
                  </p>
                  <p>
                    Time Taken: <strong>{question.time_taken}</strong>
                  </p>
                  <p>
                    Points: <strong>{question.points}</strong>
                  </p>
                </div>
              ))
            ) : (
              <p>No question history available</p>
            )}
          </div>
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default MyProfile;
