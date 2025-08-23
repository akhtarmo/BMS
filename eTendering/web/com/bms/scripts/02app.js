import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { setupFilterEvents } from './filters.js';
import { setupProgressTracker } from './progress-tracker.js';
import { setupCharts } from './charts.js';
import { setupBottlenecksTable } from './bottlenecks.js';
import { addDynamicStyles } from './ui-handlers.js';

document.addEventListener('DOMContentLoaded', function() {
    addDynamicStyles();
    setupFilterEvents();
    setupProgressTracker();
    setupCharts();
    setupBottlenecksTable();
    console.log('Tender Lifecycle Tracker dashboard initialized.');
});