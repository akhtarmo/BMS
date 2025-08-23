// --------- MOCK DATA (Replace with API/Firebase in production) ----------
const mockUser = {
  id: 'evaluator1',
  name: 'Amira Al-Fahad'
};

const assignedEvents = [
  {
    eventName: 'Procurement of Studio Lighting',
    evaluationType: 'Technical',
    deadline: '2024-07-18',
    status: 'In Progress',
    assignedTo: ['evaluator1'],
    tenderType: 'Open'
  },
  {
    eventName: 'Satellite Uplink Service',
    evaluationType: 'Technical',
    deadline: '2024-07-21',
    status: 'Pending',
    assignedTo: ['evaluator1'],
    tenderType: 'Invited'
  },
  {
    eventName: 'Broadcast Equipment',
    evaluationType: 'Commercial',
    deadline: '2024-07-11',
    status: 'Complete',
    assignedTo: ['evaluator1'],
    tenderType: 'Open'
  },
  {
    eventName: 'Archival Storage Solution',
    evaluationType: 'Technical',
    deadline: '2024-07-26',
    status: 'In Progress',
    assignedTo: ['evaluator2'],
    tenderType: 'Open'
  }
];
const pendingEvaluations = [
  {
    event: 'Procurement of Studio Lighting',
    phase: 'Technical',
    supplier: 'Qatar Media',
    due: '2024-07-17',
    status: 'Pending',
    assignedTo: ['evaluator1']
  },
  {
    event: 'Procurement of Studio Lighting',
    phase: 'Technical',
    supplier: 'TechVision',
    due: '2024-07-17',
    status: 'In Progress',
    assignedTo: ['evaluator1']
  },
  {
    event: 'Satellite Uplink Service',
    phase: 'Technical',
    supplier: 'ArabSat',
    due: '2024-07-20',
    status: 'Pending',
    assignedTo: ['evaluator1']
  },
  {
    event: 'Broadcast Equipment',
    phase: 'Commercial',
    supplier: 'SoundGear',
    due: '2024-07-10',
    status: 'Complete',
    assignedTo: ['evaluator1']
  }
];

const supplierScoresIndividual = {
  criteria: ['Innovation', 'Local Support', 'Pricing', 'Warranty', 'Experience'],
  suppliers: [
    {
      name: 'Qatar Media',
      scores: [90, 72, 65, 88, 80]
    },
    {
      name: 'TechVision',
      scores: [95, 80, 60, 80, 83]
    },
    {
      name: 'ArabSat',
      scores: [79, 77, 85, 86, 67]
    }
  ]
};
const supplierScoresConsolidated = {
  criteria: ['Innovation', 'Local Support', 'Pricing', 'Warranty', 'Experience'],
  suppliers: [
    {
      name: 'Qatar Media',
      scores: [88, 70, 66, 85, 79]
    },
    {
      name: 'TechVision',
      scores: [93, 79, 62, 78, 81]
    },
    {
      name: 'ArabSat',
      scores: [78, 76, 84, 84, 66]
    }
  ]
};

const weightedScores = [
  { supplier: 'Qatar Media', tender: 'Studio Lighting', score: 81.3 },
  { supplier: 'TechVision', tender: 'Studio Lighting', score: 86.2 },
  { supplier: 'ArabSat', tender: 'Satellite Uplink Service', score: 79.2 },
  { supplier: 'SoundGear', tender: 'Broadcast Equipment', score: 84.6 }
];

// --------- HELPERS FOR BRAND COLORS ----------
function statusColor(status) {
  switch (status) {
    case 'Complete': return 'ajz-status-green';
    case 'In Progress': return 'ajz-status-amber';
    case 'Pending': return 'ajz-status-red';
    default: return '';
  }
}
function formatDate(date) {
  // Expects yyyy-mm-dd
  return new Date(date).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'});
}
function todayPlusNDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// --------- ASSIGNED EVENTS WIDGET ----------
function renderAssignedEvents() {
  const tbody = document.getElementById('assignedEventsTable').querySelector('tbody');
  tbody.innerHTML = '';
  const visible = assignedEvents.filter(ev => ev.assignedTo.includes(mockUser.id));
  visible.forEach(ev => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${ev.eventName}</td>
      <td>
        <span class="ajz-chip">${ev.evaluationType}</span>
      </td>
      <td>${formatDate(ev.deadline)}</td>
      <td>
        <span class="ajz-chip ${statusColor(ev.status)}" style="background:none;color:inherit;">${ev.status}</span>
      </td>`
    tbody.appendChild(tr);
  });
}

// --------- PENDING EVALUATIONS WIDGET + FILTERS ----------
function getPendingFiltered() {
  const phase = document.getElementById('phaseFilter').value;
  const tenderType = document.getElementById('tenderTypeFilter').value;
  // Map eventName to tenderType
  const tenderTypeMap = {};
  assignedEvents.forEach(e => { tenderTypeMap[e.eventName] = e.tenderType; });

  return pendingEvaluations.filter(ev =>
    ev.assignedTo.includes(mockUser.id) &&
    (!phase || ev.phase === phase) &&
    (!tenderType || tenderTypeMap[ev.event] === tenderType)
  );
}

function pendingKPIStats(filtered) {
  let red = 0, amber = 0, green = 0;
  filtered.forEach(ev => {
    if (ev.status === 'Pending') red++;
    else if (ev.status === 'In Progress') amber++;
    else if (ev.status === 'Complete') green++;
  });
  return { red, amber, green, total: red + amber + green };
}
function renderPendingKPI(filtered) {
  const kpi = pendingKPIStats(filtered);
  const el = document.getElementById('pendingKPIContainer');
  el.innerHTML = `
    <span class="ajz-kpi-count">${kpi.total}</span>
    <span class="ajz-kpi-label">pending scoring tasks</span>
    <span class="ajz-kpi-status-dot ajz-status-green"></span> ${kpi.green}
    <span class="ajz-kpi-status-dot ajz-status-amber"></span> ${kpi.amber}
    <span class="ajz-kpi-status-dot ajz-status-red"></span> ${kpi.red}
  `;
}

function renderPendingTable(filtered) {
  const tbody = document.getElementById('pendingEvaluationsTable').querySelector('tbody');
  tbody.innerHTML = '';
  filtered.forEach(ev => {
    const dotClass = statusColor(ev.status);
    tbody.innerHTML += `
      <tr>
        <td>${ev.event}</td>
        <td><span class="ajz-chip">${ev.phase}</span></td>
        <td>${ev.supplier}</td>
        <td>${formatDate(ev.due)}</td>
        <td><span class="ajz-kpi-status-dot ${dotClass}"></span> ${ev.status}</td>
      </tr>
    `;
  });
}

document.getElementById('phaseFilter').addEventListener('change', onPendingFilter);
document.getElementById('tenderTypeFilter').addEventListener('change', onPendingFilter);
function onPendingFilter() {
  const filtered = getPendingFiltered();
  renderPendingKPI(filtered);
  renderPendingTable(filtered);
}

// --------- SUPPLIER SCORES TABLE (HEATMAP) ----------
let scoresView = 'individual';

function getScoresData() {
  return scoresView === 'individual' ? supplierScoresIndividual : supplierScoresConsolidated;
}
function scoreColor(val) {
  // Green >90, gold-yellow >80, muted gold >70, neutral >60, light-gray otherwise
  if (val >= 90) return 'background: #C9A14A1A; color: #333; border: 1.5px solid #C9A14A;';
  if (val >= 80) return 'background: #FFF8E1; color:#333; border: 1.5px solid #D8BC7A;';
  if (val >= 70) return 'background: #F5DFB6; color: #002147;';
  if (val >= 60) return 'background: #F5F5F5; color: #333;';
  return 'background: #F1F1F7; color: #999;';
}

function renderSupplierScores() {
  const data = getScoresData();
  const tbl = document.getElementById('supplierScoresTable');
  // Header
  let html = '<thead><tr><th>Supplier</th>';
  data.criteria.forEach(c => html += `<th>${c}</th>`);
  html += '</tr></thead><tbody>';
  data.suppliers.forEach(sup => {
    html += `<tr><td class="ajz-heatmap-row-header">${sup.name}</td>`;
    sup.scores.forEach(score =>
      html += `<td class="ajz-heatmap-cell" style="${scoreColor(score)}">${score}</td>`)
    html += '</tr>';
  });
  html += '</tbody>';
  tbl.innerHTML = html;
}
document.getElementById('viewIndividual').addEventListener('click', () => {
  scoresView = 'individual';
  document.getElementById('viewIndividual').classList.add('ajz-chip-active');
  document.getElementById('viewConsolidated').classList.remove('ajz-chip-active');
  renderSupplierScores();
});
document.getElementById('viewConsolidated').addEventListener('click', () => {
  scoresView = 'consolidated';
  document.getElementById('viewConsolidated').classList.add('ajz-chip-active');
  document.getElementById('viewIndividual').classList.remove('ajz-chip-active');
  renderSupplierScores();
});

// --------- WEIGHTED SCORE BAR CHART ----------
let weightedScoresSort = 'score';
document.querySelectorAll('input[name=sortBar]').forEach(radio => {
  radio.addEventListener('change', e => {
    weightedScoresSort = e.target.value;
    renderBarChart();
  });
});

let weightedScoreChart; // Store the chart instance

function renderBarChart() {
  const grouped = {};
  weightedScores.forEach(item => {
    if (!grouped[item.tender]) grouped[item.tender] = [];
    grouped[item.tender].push(item);
  });

  // Collate all suppliers and scores (could be by tender, but show all for brevity)
  let data = weightedScores.slice();
  if (weightedScoresSort === 'supplier') {
    data.sort((a,b) => a.supplier.localeCompare(b.supplier));
  } else {
    data.sort((a,b) => b.score - a.score);
  }

  const labels = data.map(x => x.supplier + ' (' + x.tender + ')');
  const scores = data.map(x => x.score);

  // Destroy if exists
  if (weightedScoreChart) weightedScoreChart.destroy();

  const ctx = document.getElementById('weightedScoreChart').getContext('2d');
  weightedScoreChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Weighted Score',
        data: scores,
        backgroundColor: scores.map(score =>
          score >= 86 ? '#C9A14A'
          : score >= 82 ? '#D8BC7A'
          : score >= 78 ? '#002147' : '#F5F5F5'
        ),
        borderRadius: 8,
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: '#E6E6E6' },
          ticks: { color: '#333', font: { size: 13 } }
        },
        y: {
          grid: { color: '#F5F5F5' },
          ticks: { color: '#002147', font: { weight: 600, size: 13 } }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// --------- SUMMARY BAR ---------
function renderSummaryBar() {
  // Only tenders assigned to current evaluator
  const visible = assignedEvents.filter(ev => ev.assignedTo.includes(mockUser.id));
  const total = visible.length;
  document.getElementById('totalTenders').textContent = total;
  // % completed = completed / total of assigned
  const numCompleted = visible.filter(ev => ev.status === 'Complete').length;
  const percent = total ? Math.round((numCompleted/total)*100) : 0;
  document.getElementById('percentCompleted').textContent = percent + '%';
  // Next upcoming deadlines
  const now = new Date();
  const next3 = visible
    .filter(ev => new Date(ev.deadline) >= now)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 2)
    .map(ev => formatDate(ev.deadline));
  document.getElementById('upcomingDeadlines').textContent = next3.length ? next3.join(', ') : 'None';
}

function setUserWelcome() {
  document.querySelector('.ajz-user-name').textContent = `Welcome, ${mockUser.name}`;
}

// --------- ACTION BUTTONS EVENTS -----------
document.getElementById('continueScoringBtn').addEventListener('click', () => {
  alert('Continue scoring where you left off.');
});
document.getElementById('viewSheetBtn').addEventListener('click', () => {
  alert('Opening evaluation sheet...');
});
document.getElementById('submitEvaluationBtn').addEventListener('click', () => {
  alert('Final evaluation submitted!');
});

// ---------- INITIAL PAGE LOAD -----------
function onLoad() {
  setUserWelcome();
  renderAssignedEvents();
  onPendingFilter();
  renderSupplierScores();
  renderBarChart();
  renderSummaryBar();
}

window.addEventListener('DOMContentLoaded', onLoad);

