import { getChartInstance, updateTenderStatusChartData, updateTimelineChartData } from './chart-config.js';

// --- UI Interaction Handlers ---

export function applyFilters() {
    const department = document.getElementById('department').value;
    const category = document.getElementById('category').value;
    const tenderType = document.getElementById('tender-type').value;
    const timeRange = document.getElementById('time-range').value;

    setLoadingState(true);

    setTimeout(() => {
        // Update summary cards (simulate with random data)
        const totalTendersCard = document.querySelector('.summary-card:nth-child(1) .card-value');
        if (totalTendersCard) totalTendersCard.textContent = Math.floor(Math.random() * 50 + 100);
        const avgEvalCard = document.querySelector('.summary-card:nth-child(2) .card-value');
        if (avgEvalCard) avgEvalCard.textContent = (Math.random() * 15 + 10).toFixed(1) + ' days';
        const slaCard = document.querySelector('.summary-card:nth-child(3) .card-value');
        if (slaCard) slaCard.textContent = Math.floor(Math.random() * 10 + 84) + '%';

        // Update progress tracker
        const trackerCounts = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20 + 8));
        document.querySelectorAll('.progress-tracker .stage-count').forEach((el, i) => {
            el.textContent = trackerCounts[i] || 1;
        });

        // Update charts
        updateTenderStatusChartData(Array.from({ length: 6 }, () => Math.floor(Math.random() * 50)));
        updateTimelineChartData(Array.from({ length: 12 }, () => Math.floor(Math.random() * 10 + 15)));

        // Update bottleneck table
        const tableBody = document.querySelector('#bottlenecks-table tbody');
        if (tableBody) {
            // Remove all but 3 rows to keep table length reasonable
            while (tableBody.rows.length > 2) tableBody.deleteRow(0);
            // Add a new dynamic row
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td>TN-DEMO-${Math.floor(Math.random()*100)}</td>
                <td>Filtered Result</td>
                <td>${department !== 'all' ? capitalize(department) : 'Various'}</td>
                <td>Approver ${String.fromCharCode(65 + Math.floor(Math.random()*3))}</td>
                <td>${Math.floor(Math.random()*10 + 1)}</td>
                <td><span class="status-badge ${['normal', 'warning', 'critical'][Math.floor(Math.random()*3)]}">Pending</span></td>
            `;
        }
        setLoadingState(false);
        displayFlashMessage('Filters applied successfully');
    }, 1200);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function handleStageClick(e) {
    const stageNameElement = e.currentTarget.querySelector('.stage-name');
    if (stageNameElement) {
        const stageName = stageNameElement.textContent;
        alert(`Filtering/Viewing detailed tenders in "${stageName}" stage (Demo).`);
    }
}

export function handleChartClick(e) {
    if (!e || !e.target || e.target.tagName !== 'CANVAS') return;
    const canvasId = e.target.id;
    const chart = getChartInstance(canvasId);
    if (!chart) return;
    const elements = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
    if (elements.length) {
        const { datasetIndex, index } = elements[0];
        const label = chart.data.labels[index];
        const value = chart.data.datasets[datasetIndex].data[index];
        alert(`Viewing detailed breakdown of "${label}" tenders (${value} items) (Demo).`);
    }
}

export function handleTimelineChartClick(e) {
    if (!e || !e.target || e.target.tagName !== 'CANVAS') return;
    const chart = getChartInstance('timeline-chart');
    if(!chart) return;
    const points = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
    if (points.length) {
        const { datasetIndex, index } = points[0];
        const label = chart.data.labels[index];
        const value = chart.data.datasets[datasetIndex].data[index];
        alert(`Details for ${label}: Average ${value} days (Demo)`);
    }
}

// --- UI Helper Functions ---

export function displayFlashMessage(messageText) {
    const existingMessage = document.querySelector('.filter-message');
    if (existingMessage) existingMessage.remove();
    const message = document.createElement('div');
    message.className = 'filter-message';
    message.textContent = messageText;
    document.body.appendChild(message);
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => message.remove(), 300);
    }, 2500);
}

function setLoadingState(isLoading) {
    const selectors = [
        '.summary-container',
        '.tracker-container',
        '.charts-container',
        '.bottlenecks-container'
    ];
    selectors.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
            if (isLoading) el.classList.add('loading');
            else el.classList.remove('loading');
        }
    });
}

// Dynamic styles for loading, flash messages
export function addDynamicStyles() {
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            .loading { position:relative; opacity:0.6; pointer-events:none; min-height:100px; }
            .loading::after {
                content:''; position:absolute; top:calc(50% - 20px); left:calc(50% - 20px);
                width:40px;height:40px;border:4px solid var(--light-gray);
                border-top-color:var(--deep-blue);border-radius:50%;
                animation:spin 1s linear infinite;z-index:10;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            .filter-message {
                position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
                background:var(--deep-blue);color:white;padding:0.75rem 1.5rem;
                border-radius:4px;box-shadow:0 2px 10px rgba(0,0,0,0.2);
                animation:fadeIn 0.3s ease-out;z-index:1000;opacity:1;
            }
            @keyframes fadeIn { from{ opacity:0; transform:translate(-50%,20px); }
                                to{ opacity:1; transform:translate(-50%,0); } }
            @keyframes fadeOut { from{ opacity:1; transform:translate(-50%,0); }
                                 to{ opacity:0; transform:translate(-50%,20px);} }
        `;
        document.head.appendChild(style);
    }
}