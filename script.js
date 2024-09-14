// Initialize Chart.js bar chart
const ctx = document.getElementById('roi-chart').getContext('2d');

// Placeholder for chart (empty until button is clicked)
let chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [], // Placeholder for years or months
    datasets: [
      {
        label: 'Average Market Return (10%)',
        data: [],
        backgroundColor: 'gray',
        borderRadius: 5,
      },
      {
        label: 'Prism Point Trading\'s Potential Earnings',
        data: [],
        backgroundColor: '#00d46a',
        borderRadius: 5,
      }
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Money Earned ($)',
          color: '#00d46a' // Set Y axis label to green
        },
        ticks: {
          color: '#00d46a' // Set Y axis ticks to green
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time Period',
          color: '#00d46a' // Set X axis label to green
        },
        ticks: {
          color: '#00d46a', // Set X axis ticks to green
          callback: function(value, index, values) {
            return index + 1; // Manually ensure the labels start from 1
          }
        }
      }
    }
  }
});

// Function to format large numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Function to calculate returns
function calculateReturns() {
  const investableCash = parseFloat(document.getElementById('investable-cash').value) || 0;
  const monthlyReturn = parseFloat(document.getElementById('risk-appetite').value) / 100;
  const isMonths = document.getElementById('months-btn').classList.contains('active');

  let timePeriods = [];
  let marketReturns = [];
  let prismPointReturns = [];

  if (isMonths) {
    for (let i = 1; i <= 12; i++) {
      timePeriods.push(i); // Use 1 to 12 for months
      const marketReturn = investableCash * Math.pow(1 + 0.10 / 12, i); // Monthly compounding for market
      marketReturns.push(marketReturn);
      const prismPointReturn = investableCash * Math.pow(1 + monthlyReturn, i); // Monthly compounding for Prism Point
      prismPointReturns.push(prismPointReturn);
    }
    document.getElementById('return-period').innerText = '12 Months';
    document.getElementById('return-period-graystone').innerText = '12 Months';
  } else {
    for (let i = 1; i <= 5; i++) {
      timePeriods.push(i); // Use 1 to 5 for years
      const marketReturn = investableCash * Math.pow(1 + 0.10, i); // Annual compounding for market
      marketReturns.push(marketReturn);
      const prismPointReturn = investableCash * Math.pow(1 + monthlyReturn, i * 12); // Monthly compounding for Prism Point
      prismPointReturns.push(prismPointReturn);
    }
    document.getElementById('return-period').innerText = '5 Years';
    document.getElementById('return-period-graystone').innerText = '5 Years';
  }

  // Update chart data
  chart.data.labels = timePeriods;
  chart.data.datasets[0].data = marketReturns;
  chart.data.datasets[1].data = prismPointReturns;
  chart.update();

  // Update the return values for the last period (5 years or 12 months)
  const marketFinalReturn = marketReturns[marketReturns.length - 1];
  const prismPointFinalReturn = prismPointReturns[prismPointReturns.length - 1];
  document.getElementById('market-return').innerText = `$${formatNumber(marketFinalReturn.toFixed(2))}`;
  document.getElementById('graystone-return').innerText = `$${formatNumber(prismPointFinalReturn.toFixed(2))}`;

  // Calculate and display percentage returns
  const marketPercentReturn = (marketFinalReturn - investableCash) / investableCash * 100;
  const prismPointPercentReturn = (prismPointFinalReturn - investableCash) / investableCash * 100;
  document.getElementById('market-percent').innerText = `${marketPercentReturn.toFixed(1)}%`;
  document.getElementById('graystone-percent').innerText = `${prismPointPercentReturn.toFixed(1)}%`;
}

// Event listener for the button
document.getElementById('calculate-btn').addEventListener('click', calculateReturns);

// Event listener for the time period toggle (Years or Months)
document.getElementById('btn-years').addEventListener('click', function () {
  document.getElementById('btn-years').classList.add('active');
  document.getElementById('btn-months').classList.remove('active');
});
document.getElementById('btn-months').addEventListener('click', function () {
  document.getElementById('btn-years').classList.remove('active');
  document.getElementById('btn-months').classList.add('active');
});

// Event listener to update the risk level label
document.getElementById('risk-appetite').addEventListener('input', function () {
  const riskLevel = ['1%', '2%', '3%', '4%', '5%', '6%', '7%', '8%', '9%', '10%'][this.value - 1];
  document.getElementById('risk-level').innerText = riskLevel;
});
