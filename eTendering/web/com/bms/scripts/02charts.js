// Chart initialization and events
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { initTenderStatusChart, initTimelineChart } from './chart-config.js';
import { handleChartClick, handleTimelineChartClick } from './ui-handlers.js';

export function setupCharts() {
    // Register plugins ONCE, globally. Chart is global if loaded via import map.
    if (typeof Chart !== 'undefined' && typeof Chart.register === 'function') {
        Chart.register(ChartDataLabels);
    }

    initTenderStatusChart();
    initTimelineChart();

    // Chart event listeners
    const tenderStatusChartCanvas = document.getElementById('tenders-status-chart');
    if (tenderStatusChartCanvas) {
        tenderStatusChartCanvas.addEventListener('click', handleChartClick);
    }
    const timelineChartCanvas = document.getElementById('timeline-chart');
     if (timelineChartCanvas) {
         timelineChartCanvas.addEventListener('click', handleTimelineChartClick);
     }
}