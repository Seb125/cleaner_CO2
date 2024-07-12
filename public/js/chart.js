

export function initializeChart(chartData) {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    const forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Forecast Data',
                data: chartData.vals,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 4
            }]
        },
        options: {
            plugins:{
                legend:
                {
                    labels: {
                        color: "white"
                    }
                },
                annotation: {
                    annotations: {
                        shadedRegion1: {
                            type: 'box',
                            xMin: chartData.time_frames[0].start, // 1pm (13:00)
                            xMax: chartData.time_frames[0].end, // 2pm (14:00)
                            backgroundColor: 'rgba(72, 236, 89, 0.25)'
                        },
                        shadedRegion2: {
                            type: 'box',
                            xMin: chartData.time_frames[1].start, // 1pm (13:00)
                            xMax: chartData.time_frames[1].end, // 2pm (14:00)
                            backgroundColor: 'rgba(255, 99, 132, 0.25)'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "grey"
                    },
                    ticks: {
                        color: "white"
                    }
                },
                x: {
                    grid: {
                        color: "grey"
                    },
                    ticks: {
                        color: "white"
                    }
                }
                
            }
        }
    });
}

