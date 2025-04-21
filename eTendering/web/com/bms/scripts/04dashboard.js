// Demo data
const activeTendersData = [
  {name: "Corporate Video Production", deadline: "2024-07-21T19:00", status: "Open"},
  {name: "IT Hardware Supply", deadline: "2024-07-10T15:30", status: "Submitted"},
  {name: "Transcription Services (English-Arabic)", deadline: "2024-07-15T23:59", status: "Draft"},
  {name: "Studio Lighting Upgrade", deadline: "2024-07-25T14:00", status: "Open"},
];

const draftBidsData = [
  {name: "Transcription Services (English-Arabic)", lastEdit: "2024-07-05", link: "#"},
];

const clarificationsData = [
  {event: "Corporate Video Production", due: "2024-07-09T18:00", link: "#"},
  {event: "IT Hardware Supply", due: "2024-07-08T14:00", link: "#"},
];

const submittedBidsData = [
  {
    name: "IT Hardware Supply",
    date: "2024-07-03T14:40",
    status: "Under Evaluation",
    statusKey: "under-eval",
    link: "#",
  },
  {
    name: "Broadcast Cameras Procurement",
    date: "2024-06-29T17:10",
    status: "Clarification",
    statusKey: "clarification",
    link: "#",
  },
  {
    name: "Newsroom Furniture Supply",
    date: "2024-06-20T11:30",
    status: "Evaluated",
    statusKey: "evaluated",
    link: "#",
  },
  {
    name: "Off-site Storage Service",
    date: "2024-06-12T15:00",
    status: "Awarded",
    statusKey: "awarded",
    link: "#",
  },
  {
    name: "Obsolete Devices Disposal",
    date: "2024-06-10T16:30",
    status: "Not Awarded",
    statusKey: "not-awarded",
    link: "#",
  }
];

const upcomingDeadlinesData = [
  {name: "IT Hardware Supply", deadline: "2024-07-10T15:30"},
  {name: "Transcription Services (English-Arabic)", deadline: "2024-07-15T23:59"},
  {name: "Corporate Video Production", deadline: "2024-07-21T19:00"},
  {name: "Studio Lighting Upgrade", deadline: "2024-07-25T14:00"},
];

const statusOverviewData = {
  labels: [
    "Draft", "Submitted", "Under Evaluation", "Evaluated", "Clarification", "Awarded", "Not Awarded"
  ],
  values: [1, 2, 1, 1, 1, 1, 1],
  colors: [
    "#002147", // Draft - deep blue
    "#2196F3", // Submitted - bright blue
    "#4CAF50", // Under Eval - green
    "#D8BC7A", // Evaluated - light gold
    "#C9A14A", // Clarification - gold
    "#4CAF50", // Awarded - green
    "#F44336", // Not awarded - red
  ],
  keys: [
    "draft", "submitted", "under-eval", "evaluated", "clarification", "awarded", "not-awarded"
  ]
};

// --- Active Tenders ---
function renderActiveTenders(data) {
  const tbody = document.getElementById('active-tenders-tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    let statusPill, actionBtn = '';
    switch (row.status) {
      case 'Open':
        statusPill = `<span class="pill pill-gold">Open</span>`;
        actionBtn = `<button class="btn-ghost" title="Submit Bid">Submit Bid</button>`;
        break;
      case 'Submitted':
        statusPill = `<span class="pill pill-blue">Submitted</span>`;
        actionBtn = `<button class="btn-ghost" title="View Submission">View</button>`;
        break;
      case 'Draft':
        statusPill = `<span class="pill pill-draft">Draft</span>`;
        actionBtn = `<button class="btn-ghost" title="Continue Draft">Edit</button>`;
        break;
      default:
        statusPill = `<span class="pill pill-neutral">${row.status}</span>`;
    }
    let deadlineHtml = `<span title="${row.deadline}">${formatDeadline(row.deadline)}</span>`;
    tbody.innerHTML += `
      <tr>
        <td>${row.name}</td>
        <td>${deadlineHtml}</td>
        <td>${statusPill}</td>
        <td>${actionBtn}</td>
      </tr>
    `;
  });
}

// --- Draft Bids ---
function renderDraftBids(data) {
  const badge = document.getElementById('draft-bids-kpi');
  badge.textContent = data.length;
  
  const list = document.getElementById('draft-bids-list');
  list.innerHTML = '';
  if (!data.length) {
    list.innerHTML = `<li><span class="item-main" style="color:#9c9c9c;">No Drafts Saved</span></li>`;
    document.getElementById('continue-draft').disabled = true;
    return;
  }
  data.forEach(draft => {
    let li = document.createElement('li');
    li.innerHTML = `
      <span class="item-main">${draft.name}</span>
      <span class="timeline-date">Last edited: ${formatDateYMD(draft.lastEdit)}</span>
      <button class="btn-ghost" onclick="window.location='${draft.link}'">Resume</button>
    `;
    list.appendChild(li);
  });
  document.getElementById('continue-draft').disabled = false;
}
document.getElementById('continue-draft').onclick = function() {
  // Go to first draft (demo)
  if (draftBidsData.length) window.location = draftBidsData[0].link;
};

// --- Submitted Bids Timeline ---
function renderSubmittedBids(data) {
  const timeline = document.getElementById('submitted-bids-timeline');
  timeline.innerHTML = '';
  data.forEach(bid => {
    let cls = "status-"+bid.statusKey;
    let statusPill = getStatusPill(bid.status);
    timeline.innerHTML += `
      <li class="${cls}">
        <span class="timeline-main-title">${bid.name}</span>
        <span class="timeline-date">${formatDateYMD(bid.date)}</span>
        <span class="timeline-status">${statusPill}</span>
        <button class="btn-ghost" onclick="window.location='${bid.link}'" title="View Submission">View</button>
      </li>
    `;
  });
}

// --- Upcoming Deadlines ---
function renderUpcomingDeadlines(deadlines) {
  const now = new Date();
  const container = document.getElementById('upcoming-deadlines-list');
  container.innerHTML = '';
  let soonest = deadlines.map(d => ({...d, parsed: new Date(d.deadline)}))
    .sort((a,b)=> a.parsed-b.parsed);
  soonest.forEach(row => {
    const dueDate = row.parsed;
    const diffDays = Math.ceil((dueDate-now)/(1000*60*60*24));
    const isSoon = diffDays >= 0 && diffDays <= 5;
    // Date box: show Mon 10, e.g.
    const dateText = dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeText = dueDate.toLocaleTimeString(undefined, { hour: '2-digit', minute:'2-digit', hour12: false });
    let dueinStr = '', dueClass = '';
    if (diffDays > 1) {
      dueinStr = `Due in ${diffDays} days`;
    } else if (diffDays === 1) {
      dueinStr = `Due Tomorrow`;
    } else if (diffDays === 0) {
      dueinStr = `Due Today`;
    } else {
      dueinStr = `Closed`;
      dueClass = 'pill pill-neutral'
    }
    let soonClass = isSoon ? 'deadline-duein' : '';
    container.innerHTML += `
      <div class="upcoming-deadline-card">
        <div class="deadline-datebox">
          <div>${dateText}</div>
          <div style="font-size:.93em;font-weight:400;color:#686868;">${timeText}</div>
        </div>
        <div class="deadline-main">
          <div class="deadline-title">${row.name}</div>
          <div class="${soonClass}">${dueinStr}</div>
        </div>
        ${isSoon && diffDays>=0 ? `<div class="pill pill-alert">ALERT</div>` : ''}
      </div>
    `;
  });
}

// --- Clarifications Pending ---
function renderClarifications(data) {
  const list = document.getElementById('clarifications-list');
  const count = document.getElementById('clarifications-count');
  if (!data.length) {
    list.innerHTML = `<li><span class="item-main" style="color:#9c9c9c;">None Pending</span></li>`;
    count.style.display = "none";
    return;
  }
  count.style.display = "";
  count.textContent = data.length;
  list.innerHTML = '';
  data.forEach(row => {
    const dueDate = new Date(row.due);
    const dueStr = `${formatDateYMD(row.due, true)}`;
    list.innerHTML += `
      <li>
        <span class="item-main">${row.event}</span>
        <span class="due-date">Reply by: ${dueStr}</span>
        <button class="btn-ghost" onclick="window.location='${row.link}'">Respond</button>
      </li>
    `;
  });
}

// --- Bid Status Donut ---
function renderStatusDonut(data) {
  const ctx = document.getElementById('status-donut').getContext('2d');
  if (window.statusDonutChart) window.statusDonutChart.destroy();
  window.statusDonutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: data.colors
      }]
    },
    options: {
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed}`
          }
        }
      }
    }
  });
  renderStatusLegend(data);
}
function renderStatusLegend(data) {
  const legend = document.getElementById('donut-legend');
  legend.innerHTML = '';
  data.labels.forEach((lbl, idx) => {
    legend.innerHTML += `<span class="status-legend-item">
      <span class="status-dot" style="background:${data.colors[idx]};"></span>${lbl}
    </span>`;
  });
}

function getStatusPill(status) {
  switch (status) {
    case "Open":
      return `<span class="pill pill-gold">Open</span>`;
    case "Submitted":
      return `<span class="pill pill-blue">Submitted</span>`;
    case "Under Evaluation":
      return `<span class="pill pill-green">Under Evaluation</span>`;
    case "Clarification":
      return `<span class="pill pill-gold">Clarification</span>`;
    case "Evaluated":
      return `<span class="pill pill-gold">Evaluated</span>`;
    case "Awarded":
      return `<span class="pill pill-green">Awarded</span>`;
    case "Not Awarded":
      return `<span class="pill pill-alert">Not Awarded</span>`;
    case "Draft":
      return `<span class="pill pill-draft">Draft</span>`;
    default:
      return `<span class="pill pill-neutral">${status}</span>`;
  }
}

// --- Date Formatting ---
function formatDateYMD(iso, short = false) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  if (short)
    return d.toLocaleString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    +' '+d.toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit', hour12: false});
}
function formatDeadline(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })+
    ' @ '+d.toLocaleTimeString(undefined, {hour:'2-digit',minute:'2-digit', hour12:false});
}

// --- Filtering (demo: just filters tender names) ---
function setupFilters() {
  const tenderNameFilter = document.getElementById('filter-tender-name');
  const statusFilter = document.getElementById('filter-status');
  const deadlineFrom = document.getElementById('filter-deadline-from');
  const deadlineTo = document.getElementById('filter-deadline-to');
  const categoryFilter = document.getElementById('filter-category');
  function filterActiveTenders() {
    const name = tenderNameFilter.value.trim().toLowerCase();
    const status = statusFilter.value;
    const fromDate = deadlineFrom.value;
    const toDate = deadlineTo.value;
    // For demo, category is omitted
    let data = activeTendersData.filter(row => {
      let match = true;
      if (name && !row.name.toLowerCase().includes(name)) match = false;
      if (status && row.status.toLowerCase() !== status.replace('_','-')) match = false;
      if (fromDate && new Date(row.deadline)<new Date(fromDate)) match = false;
      if (toDate && new Date(row.deadline)>new Date(toDate+"T23:59:59")) match = false;
      // no real category
      return match;
    });
    renderActiveTenders(data);
  }
  [tenderNameFilter, statusFilter, deadlineFrom, deadlineTo, categoryFilter].forEach(el=>{
    el.addEventListener('input', filterActiveTenders);
  });
  document.getElementById('clear-filters').onclick = function() {
    tenderNameFilter.value = "";
    statusFilter.value = "";
    deadlineFrom.value = "";
    deadlineTo.value = "";
    renderActiveTenders(activeTendersData);
  };
}

// --- Action Buttons (Active Tenders) ---
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'BUTTON') {
    if (e.target.textContent.includes('Edit')) {
      // simulate continue draft
      document.getElementById('continue-draft').click();
    }
    if (e.target.textContent.includes('Submit Bid')) {
      alert('Bid submission page (demo)');
    }
    if (e.target.textContent.includes('View')) {
      alert('View submission page (demo)');
    }
    if (e.target.textContent.includes('Withdraw Bid')) {
      if (confirm('Are you sure you want to withdraw your bid?')) {
        alert('Bid withdrawn (demo)');
      }
    }
  }
});

// --- Page Init ---
function initDashboard() {
  renderActiveTenders(activeTendersData);
  renderDraftBids(draftBidsData);
  renderClarifications(clarificationsData);
  renderSubmittedBids(submittedBidsData);
  renderUpcomingDeadlines(upcomingDeadlinesData);
  renderStatusDonut(statusOverviewData);
  setupFilters();
}

window.addEventListener('DOMContentLoaded', initDashboard);

