import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js library

const Leaderboard = () => {
  const [vehicleData, setVehicleData] = useState([]);

  useEffect(() => {
    // Fetch vehicle data from API endpoint
    fetch('http://127.0.0.1:8000/vehicle-data')
      .then((response) => response.json())
      .then((data) => setVehicleData(data))
      .catch((error) => console.error('Error fetching vehicle data:', error));
  }, []);

  useEffect(() => {
    // Render the bar charts after vehicleData state updates
    if (vehicleData.length > 0) {
      renderVehicleCharts();
    }
  }, [vehicleData]);

  const renderVehicleCharts = () => {
    // Prepare data for the bar charts
    const vehicleCountUp = {};
    const vehicleCountDown = {};

    vehicleData.forEach((vehicle) => {
      const { vehicle_type: vehicleType, direction } = vehicle;

      if (direction === 'up') {
        vehicleCountUp[vehicleType] = (vehicleCountUp[vehicleType] || 0) + 1;
      } else if (direction === 'down') {
        vehicleCountDown[vehicleType] = (vehicleCountDown[vehicleType] || 0) + 1;
      }
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              weight: 'bold',
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
    };

    const chartConfigUp = {
      type: 'bar',
      data: {
        labels: Object.keys(vehicleCountUp),
        datasets: [
          {
            label: 'Count of Vehicles Going Up',
            data: Object.values(vehicleCountUp),
            backgroundColor: 'rgba(173, 216, 230, 0.6)', // Light blue
            borderColor: 'rgba(173, 216, 230, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    };

    const chartConfigDown = {
      type: 'bar',
      data: {
        labels: Object.keys(vehicleCountDown),
        datasets: [
          {
            label: 'Count of Vehicles Going Down',
            data: Object.values(vehicleCountDown),
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // White
            borderColor: 'rgba(173, 216, 230, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    };

    // Get chart canvases by their IDs
    const ctxUp = document.getElementById('chart-up').getContext('2d');
    const ctxDown = document.getElementById('chart-down').getContext('2d');

    // Create bar charts using Chart.js with the provided configurations
    new Chart(ctxUp, chartConfigUp);
    new Chart(ctxDown, chartConfigDown);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 text-center w-3/4">
        <h1 className="text-3xl font-bold mb-4">Vehicle Counts</h1>
        {/* <div className="grid grid-cols-2 gap-6">
         <div>
            <h2 className="text-xl font-semibold mb-2">Count of Vehicles Going Up</h2>
            <canvas id="chart-up" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Count of Vehicles Going Down</h2>
            <canvas id="chart-down" />
          </div>
        </div>  */}
        <div>
           <img src="./bar_chart.png" alt="Logo" class="center" />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
