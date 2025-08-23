// --- Example Data (replace with live data integration) ---
const bids = [
  {
    eventName: "Broadcast Equipment Supply",
    submissionDate: "2024-05-13",
    currentPhase: "Commercial",
    status: "Passed",
    phases: [
      { name: "Submitted", ts: "2024-05-13 14:00" },
      { name: "Under Technical Evaluation", ts: "2024-05-15 11:30" },
      { name: "Under Commercial Evaluation", ts: "2024-05-18 17:00" },
    ],
    scores: { technical: 85, commercial: 92, total: 89 },
    remarks: "Very strong technical proposal with competitive pricing.",
    award: { status: "Awarded", date: "2024-06-02", amount: "USD 280,000" },
    clarifications: [
      { ref: "BE001", msg: "Please confirm warranty period.", status: "Closed" },
      { ref: "BE001", msg: "Submit compliance certificate.", status: "Closed" }
    ]
  },
  {
    eventName: "Studio Lighting Upgrade",
    submissionDate: "2024-04-22",
    currentPhase: "Finalization",
    status: "AwaitingDecision",
    phases: [
      { name: "Submitted", ts: "2024-04-22 12:33" },
      { name: "Under Technical Evaluation", ts: "2024-04-24 09:10" },
      { name: "Under Commercial Evaluation", ts: "2024-04-27 13:00" },
      { name: "Finalization", ts: "2024-05-02 08:00" }
    ],
    scores: { technical: 75, commercial: 81, total: 78 },
    remarks: "",
    award: { status: "NotAwarded", date: "2024-06-05", amount: null },
    clarifications: [
      { ref: "SLU101", msg: "Clarify delivery schedule for lot 3.", status: "Closed" }
    ]
  },
  {
    eventName: "Facility Maintenance Contract",
    submissionDate: "2024-03-09",
    currentPhase: "Technical",
    status: "UnderReview",
    phases: [
      { name: "Submitted", ts: "2024-03-09 18:23" },
      { name: "Under Technical Evaluation", ts: "2024-03-12 10:00" }
    ],
    scores: null,
    remarks: "",
    award: null,
    clarifications: [
      { ref: "FMC201", msg: "Provide project manager CV.", status: "Open" }
    ]
  },
  {
    eventName: "IT Services Outsourcing",
    submissionDate: "2024-02-14",
    currentPhase: "Technical",
    status: "Failed",
    phases: [
      { name: "Submitted", ts: "2024-02-14 13:03" },
      { name: "Under Technical Evaluation", ts: "2024-02-16 09:30" }
    ],
    scores: { technical: 55, commercial: null, total: 55 },
    remarks: "Technical requirements not fully met.",
    award: { status: "NotAwarded", date: "2024-03-05", amount: null },
    clarifications: []
  }
];

// ------ Filter Controls ------
const eventFilter = document.getElementById('eventFilter');
const dateStart = document.getElementById('dateStart');
const dateEnd = document.getElementById('dateEnd');
const phaseFilter = document.getElementById('phaseFilter');
const statusFilter = document.getElementById('statusFilter');
const showAwardedOnly = document.getElementById('showAwardedOnly');

// --- Utility ---
function filterBids() {
  let filtered = bids
    .filter(bid => !eventFilter.value || bid.eventName.toLowerCase().includes(eventFilter.value.toLowerCase()))
    .filter(bid => {
      if (dateStart.value) {
        return new Date(bid.submissionDate) >= new Date(dateStart.value);
      }
      return true;
    }).filter(bid => {
      if (dateEnd.value) {
        return new Date(bid.submissionDate) <= new Date(dateEnd.value);
      }
      return true;
    }).filter(bid => !phaseFilter.value || bid.currentPhase === phaseFilter.value)
    .filter(bid => !statusFilter.value || mapStatusToGroup(bid.status) === statusFilter.value)
    .filter(bid => !showAwardedOnly.checked || (bid.award && bid.award.status === "Awarded"));
  return filtered;
}

function mapStatusToLabel(status) {
  switch (status) {
    case "UnderReview": return "Under Review";
    case "Passed": return "Passed";
    case "Failed": return "Failed";
    case "AwaitingDecision": return "Awaiting Decision";
    case "Awarded": return "Awarded";
    case "NotAwarded": return "Not Awarded";
    default: return status;
  }
}

function mapStatusToGroup(status) {
  switch (status) {
    case "UnderReview": return "Under Review";
    case "Passed": return "Passed";
    case "Failed": return "Failed";
    case "AwaitingDecision": return "Awaiting Decision";
    default: return status;
  }
}

function statusIcon(status) {
  switch (status) {
    case "Passed": return '✔️';
    case "Failed": return '❌';
    case "UnderReview": return '🕒';
    case "AwaitingDecision": return '⏳';
    case "Awarded": return '✅';
    case "NotAwarded": return '❌';
    default: return '';
  }
}

// ------ Main Table ------
function renderBidsTable(bidArr) {
  const tbody = document.getElementById('bidsTableBody');
  tbody.innerHTML = '';
  bidArr.forEach((bid, i) => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${bid.eventName}</td>
      <td>${bid.submissionDate}</td>
      <td>${bid.currentPhase}</td>
      <td>
        <span class="status-badge status-${bid.status}">
          <span>${statusIcon(bid.status)}</span>
          ${mapStatusToLabel(bid.status)}
        </span>
      </td>
      <td>
        <button class="progress-btn" data-index="${i}">
          <span class="material-icons">auto_mode</span>
        </button>
      </td>
    `;
    // To allow row click to show details on mobile: (expand feature could be added)
    tbody.appendChild(row);
  });
}

// ------ Progress Tracker ------
const processSteps = [
  "Submitted",
  "Under Technical Evaluation",
  "Under Commercial Evaluation",
  "Finalization",
  "Award Decision"
];

function renderProgressSteps(bid) {
  const cont = document.getElementById('progressSteps');
  cont.innerHTML = '';
  if (!bid) {
    cont.innerHTML = '<div class="progress-steps-placeholder">Select a bid to see detailed progress.</div>';
    return;
  }
  // Map existing steps & timestamps
  let resultSteps = processSteps.map(label => {
    let found = bid.phases.find(ph => ph.name === label);
    return found ? { label, ts: found.ts } : { label, ts: null };
  });
  // Award phase timestamp if available
  if (bid.award && bid.award.date) {
    resultSteps[resultSteps.length - 1].ts = `${bid.award.date} 10:00`;
  }
  // Find current: last set ts or by bid.currentPhase
  let activeIdx = resultSteps.findIndex(s => s.label === mapPhaseToCanonical(bid.currentPhase));
  if (activeIdx === -1) {
    activeIdx = resultSteps.findIndex(s => !s.ts);
    if (activeIdx === -1) activeIdx = resultSteps.length - 1;
  }
  let html = '<div class="progress-steps-container">';
  for (let i = 0; i < resultSteps.length; ++i) {
    let st = resultSteps[i];
    let cls = st.ts ? 'completed' : '';
    if (i === activeIdx) cls = 'active';
    let icon = '';
    if (cls === 'completed') icon = '<span class="material-icons" style="color:#fff">check_circle</span>';
    else if (cls === 'active') icon = '<span class="material-icons">fiber_manual_record</span>';
    else icon = '<span class="material-icons" style="color:#C9A14A33">radio_button_unchecked</span>';
    html += `
      <div class="progress-step ${cls}">
        <div class="icon-wrap">${icon}</div>
        <div class="step-label">${st.label.replace('Under ', '')}</div>
        ${st.ts ? `<div class="timestamp">${st.ts}</div>` : ''}
      </div>
    `;
  }
  html += '</div>';
  cont.innerHTML = html;
}
function mapPhaseToCanonical(phase) {
  if (!phase) return '';
  switch (phase.toLowerCase()) {
    case 'technical': return 'Under Technical Evaluation';
    case 'commercial': return 'Under Commercial Evaluation';
    case 'finalization': return 'Finalization';
    case 'awarddecision': return 'Award Decision';
    case 'submitted': return 'Submitted';
    default: return phase;
  }
}

// ------ Award Status ------
function renderAwardStatus(bidArr) {
  const div = document.getElementById('awardStatusContent');
  div.innerHTML = '';
  let awarded = bidArr.filter(b => b.award && b.award.status === "Awarded");
  let notAwarded = bidArr.filter(b => b.award && b.award.status === "NotAwarded");
  let parts = [];
  if (awarded.length)
    parts.push(awarded.map((b,i) => `
      <div class="award-card">
        <span><span class="material-icons">emoji_events</span> Awarded</span>
        <span><b>${b.eventName}</b></span>
        <span>Date: ${b.award.date}</span>
        ${b.award.amount ? `<span class="award-amount">Amount: ${b.award.amount}</span>` : ""}
      </div>`).join(''));
  if (notAwarded.length)
    parts.push(notAwarded.map((b,i) => `
      <div class="award-card not-awarded">
        <span><span class="material-icons">block</span> Not Awarded</span>
        <span><b>${b.eventName}</b></span>
        <span>Date: ${b.award.date}</span>
      </div>`).join(''));
  if (!parts.length) div.innerHTML = "<div>No awards to display based on filter.</div>";
  else div.innerHTML = `<div class="award-status-highlight">${parts.join('')}</div>`;
}

// ------ Scorecard ------
let scoreChartInstance = null;
function renderScorecard(bid) {
  const cont = document.getElementById('scorecardContent');
  cont.innerHTML = '';
  if (!bid || !bid.scores) {
    cont.innerHTML = `<div class='scorecard-container'><div>No score information currently visible or available for this bid.</div></div>`;
    return;
  }
  // Bar/gauge chart
  let chartId = "scorebarChart";
  cont.innerHTML = `
    <div class="scorecard-container">
      <div>
        <canvas id="${chartId}" class="scorebar"></canvas>
      </div>
      <div class="score-values-col">
        <div><b>Technical Score:</b> ${bid.scores.technical ?? '—'} / 100</div>
        <div><b>Commercial Score:</b> ${bid.scores.commercial ?? '—'} / 100</div>
        <div><b>Total Score:</b> ${bid.scores.total ?? '—'} / 100</div>
        ${bid.remarks ? `<div class='remarks-box'><b>Remarks:</b> ${bid.remarks}</div>` : ""}
      </div>
    </div>
  `;
  if (scoreChartInstance) try { scoreChartInstance.destroy(); } catch {}
  const ctx = document.getElementById(chartId).getContext('2d');
  scoreChartInstance = new window.Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Scored', 'Remaining'],
      datasets: [{
        data: [bid.scores.total, 100 - bid.scores.total],
        backgroundColor: ['#C9A14A','#F5F5F5'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        annotation: false
      }
    }
  });
}

// ------ Clarifications ------
function renderClarifications(bidArr) {
  const tbody = document.getElementById('clarificationsTableBody');
  let clarifications = [];
  bidArr.forEach(bid => {
    if (bid.clarifications)
      clarifications.push(...bid.clarifications.map(cl => ({
        ...cl, eventName: bid.eventName
      })));
  });
  tbody.innerHTML = '';
  if (!clarifications.length) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#9E9E9E;">No clarifications available.</td></tr>`;
    return;
  }
  clarifications.forEach(cl => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${cl.ref}</td>
      <td title="${cl.msg}">${cl.msg.length > 48 ? cl.msg.substring(0,45) + '…' : cl.msg}</td>
      <td>
        <span class="status-badge status-${cl.status}">${cl.status === 'Open' ? '🕒 Open' : '✔️ Closed'}</span>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ------ Bid Table Progress Button ------
function attachTableBidRowClicks(bidArr) {
  // Show progress and score when clicking "progress" button
  document.querySelectorAll('.progress-btn').forEach(btn => {
    btn.onclick = (ev) => {
      let i = btn.getAttribute('data-index');
      let bid = bidArr[i];
      renderProgressSteps(bid);
      renderScorecard(bid);
    };
  });
  // By default, show the latest bid's detail (if any)
  if (bidArr.length) {
    renderProgressSteps(bidArr[0]);
    renderScorecard(bidArr[0]);
  } else {
    renderProgressSteps(null); renderScorecard(null);
  }
}

// ------ Filter Interactions ------
function applyFiltersAndRender() {
  const arr = filterBids();
  renderBidsTable(arr);
  renderAwardStatus(arr);
  renderClarifications(arr);
  attachTableBidRowClicks(arr);
}

// Event listeners
[eventFilter, dateStart, dateEnd, phaseFilter, statusFilter, showAwardedOnly].forEach(e =>
  e.addEventListener("input", applyFiltersAndRender)
);
// For selects & checkbox, use 'change'
[phaseFilter, statusFilter, showAwardedOnly].forEach(e =>
  e.addEventListener("change", applyFiltersAndRender)
);

// ------- Initialize ------
applyFiltersAndRender();