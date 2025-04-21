import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Module-scoped chart instances
let tenderStatusChartInstance = null;
let timelineChartInstance = null;

export function initTenderStatusChart() {
    const ctx = document.getElementById('tenders-status-chart')?.getContext('2d');
    if (!ctx) return null;
    if (tenderStatusChartInstance) tenderStatusChartInstance.destroy();
    tenderStatusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Draft', 'Under Review', 'Open', 'In Evaluation', 'Awarded', 'Cancelled'],
            datasets: [{
                data: [32, 28, 45, 19, 14, 8],
                backgroundColor: [
                    '#E0E0E0','#D8BC7A','#C9A14A','#6A8CAF','#002147','#B71C1C'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 15, padding: 15 } },
                datalabels: {
                    color: ctx => {
                        const bg = ctx.dataset.backgroundColor[ctx.dataIndex];
                        return ['#002147','#B71C1C'].includes(bg) ? '#FFF' : '#333';
                    },
                    font: { weight: 'bold' },
                    formatter: (value, ctx) => {
                        const dataset = ctx.chart.data.datasets[0];
                        const total = dataset.data.reduce((a,b)=>a+b,0);
                        if (total === 0) return '0%';
                        const percentage = Math.round((value / total) * 100);
                        return percentage > 5 ? `${percentage}%` : '';
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) label += ': ';
                            if (context.parsed !== null) label += context.parsed + ' tenders';
                            return label;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
    return tenderStatusChartInstance;
}

export function initTimelineChart() {
    const ctx = document.getElementById('timeline-chart')?.getContext('2d');
    if (!ctx) return null;
    if (timelineChartInstance) timelineChartInstance.destroy();
    timelineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [{
                label: 'Average Days to Award',
                data: [22, 25, 20, 19, 23, 21, 18, 17, 16, 14, 15, 18],
                borderColor: '#C9A14A',
                backgroundColor: 'rgba(201, 161, 74, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#002147',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Days' }
                }
            },
            plugins: {
                datalabels: { display: false },
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: context => `Average: ${context.raw} days`
                    }
                }
            }
        }
    });
    return timelineChartInstance;
}

export function updateTenderStatusChartData(newData) {
    if (tenderStatusChartInstance && tenderStatusChartInstance.data.datasets.length > 0) {
        tenderStatusChartInstance.data.datasets[0].data = newData;
        tenderStatusChartInstance.update();
    }
}

export function updateTimelineChartData(newData) {
    if (timelineChartInstance && timelineChartInstance.data.datasets.length > 0) {
        timelineChartInstance.data.datasets[0].data = newData;
        timelineChartInstance.update();
    }
}

export function getChartInstance(canvasId) {
    if (canvasId === 'tenders-status-chart') return tenderStatusChartInstance;
    if (canvasId === 'timeline-chart') return timelineChartInstance;
    return Chart.getChart(canvasId);
}