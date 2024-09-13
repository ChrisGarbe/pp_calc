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
        label: 'Graystone Trading\'s Potential Earnings',
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
          text: 'Years of Investing',
          color: '#00d46a' // Set X axis label to green
        },
        ticks: {
          color: '#00d46a', // Set X axis ticks to green
          callback: function(value, index, values) {
            return 'Year ' + (index + 1); // Format as "Year #"
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
  const riskAppetite = parseInt(document.getElementById('risk-appetite').value);
  const isMonths = document.getElementById('time-period-toggle').checked; // Toggle status

  let monthlyReturn;
  switch (riskAppetite) {
    case 1: monthlyReturn = 0.05; break; // Low risk: 5% monthly
    case 2: monthlyReturn = 0.10; break; // Medium risk: 10% monthly
    case 3: monthlyReturn = 0.20; break; // High risk: 20% monthly
  }

  let timePeriods = [];
  let marketReturns = [];
  let graystoneReturns = [];

  if (isMonths) {
    for (let i = 1; i <= 12; i++) {
      timePeriods.push(`${i} Month`);
      const marketReturn = investableCash * Math.pow(1 + 0.10 / 12, i); // Monthly compounding for market
      marketReturns.push(marketReturn);
      const graystoneReturn = investableCash * Math.pow(1 + monthlyReturn, i); // Monthly compounding for Graystone
      graystoneReturns.push(graystoneReturn);
    }
    document.getElementById('return-period').innerText = '12 Months';
    document.getElementById('return-period-graystone').innerText = '12 Months';
  } else {
    for (let i = 1; i <= 5; i++) {
      timePeriods.push(`${i} Year`);
      const marketReturn = investableCash * Math.pow(1 + 0.10, i); // Annual compounding for market
      marketReturns.push(marketReturn);
      const graystoneReturn = investableCash * Math.pow(1 + monthlyReturn, i * 12); // Monthly compounding for Graystone
      graystoneReturns.push(graystoneReturn);
    }
    document.getElementById('return-period').innerText = '5 Years'; // Update to "5 Years"
    document.getElementById('return-period-graystone').innerText = '5 Years'; // Update to "5 Years"
  }

  // Update chart data
  chart.data.labels = timePeriods;
  chart.data.datasets[0].data = marketReturns;
  chart.data.datasets[1].data = graystoneReturns;
  chart.update();

  // Update the return values for the last period (12 months or 5 years)
  const marketFinalReturn = marketReturns[marketReturns.length - 1];
  const graystoneFinalReturn = graystoneReturns[graystoneReturns.length - 1];
  document.getElementById('market-return').innerText = `$${formatNumber(marketFinalReturn.toFixed(2))}`;
  document.getElementById('graystone-return').innerText = `$${formatNumber(graystoneFinalReturn.toFixed(2))}`;
}

// Event listener for the button
document.getElementById('calculate-btn').addEventListener('click', calculateReturns);

// Event listener for the time period toggle (Months or Years)
document.getElementById('time-period-toggle').addEventListener('change', function () {
  const timePeriodLabel = this.checked ? 'Months' : 'Years';
  document.getElementById('time-period-label').innerText = timePeriodLabel;
});

// Event listener to update the risk level label
document.getElementById('risk-appetite').addEventListener('input', function () {
  const riskLevel = ['Low', 'Medium', 'High'][this.value - 1];
  document.getElementById('risk-level').innerText = riskLevel;
});
