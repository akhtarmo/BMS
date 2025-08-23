import * as ChartJS from 'chart.js'; // Use namespace import for UMD build
import 'chartjs-adapter-date-fns'; // Import date adapter

// --- Chart Colors & Options ---
const primaryAccent = '#C9A14A';
const chartAccent = '#D8BC7A';
const deepBlue = '#002147';
const textColor = '#333333';
const mutedGold = '#D8BC7A';
const lightGray = '#F5F5F5';
const white = '#FFFFFF';
const otherChartColors = ['#5A8D9B', '#87CEEB', '#4682B4', '#B0C4DE', '#ADD8E6']; // Shades of blue/grey

// Access the Chart constructor via the global variable
const Chart = window.Chart;
// Set global defaults
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.color = textColor;
Chart.defaults.borderColor = '#e0e0e0';

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                boxWidth: 12,
                padding: 15,
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 33, 71, 0.9)', // Deep blue bg
            titleColor: primaryAccent,
            bodyColor: white,
            padding: 10,
            cornerRadius: 4,
            callbacks: { // Default formatter, can be overridden per chart
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        // Format as currency (simple version)
                        label += `QAR ${context.parsed.y.toLocaleString()}`;
                    } else if (context.parsed.x !== null && context.chart.options.indexAxis === 'y') { // Handle horizontal bars
                         label += `QAR ${context.parsed.x.toLocaleString()}`;
                    } else if (context.parsed !== null && (context.chart.config.type === 'pie' || context.chart.config.type === 'doughnut')) { // Handle pie/doughnut
                         label += `QAR ${context.parsed.toLocaleString()}`;
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: '#eee' // Lighter grid lines
            },
            ticks: {
                 callback: function(value) {
                     // Simple K/M formatting for larger numbers on axis
                    if (value >= 1000000) return `QAR ${value / 1000000}M`;
                    if (value >= 1000) return `QAR ${value / 1000}K`;
                    return `QAR ${value}`;
                }
            }
        },
        x: {
             grid: {
                display: false // Hide vertical grid lines usually
            },
             ticks: {
                 callback: function(value, index, ticks) {
                    // Check if the scale is the primary X axis for a horizontal bar chart
                    if (this.chart.options.indexAxis === 'y') {
                         // Apply K/M formatting for the horizontal bar's value axis
                         const numericValue = ticks[index].value;
                        if (numericValue >= 1000000) return `QAR ${numericValue / 1000000}M`;
                        if (numericValue >= 1000) return `QAR ${numericValue / 1000}K`;
                        return `QAR ${numericValue}`;
                    }
                    // Otherwise, return the default label (usually category name or time)
                    return this.getLabelForValue(value);
                 }
            }
        }
    }
};

// --- Dummy Data ---
const categories = ['IT Hardware', 'Broadcast Equip.', 'Software Licenses', 'Consulting Services', 'Events & Production', 'Marketing & Ad', 'Office Supplies', 'Facilities Mgmt'];
const departments = ['IT Department', 'Broadcast Engineering', 'News Production', 'Marketing', 'Admin & Facilities', 'Digital Platforms'];
const suppliers = ['Tech Solutions Inc.', 'Global Broadcast Gear', 'Creative Agency Pro', 'ConsultCorp', 'OfficeWorld Supplies'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // Fiscal Year or Last 12 Months

// Helper to generate random data
const randomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateRandomData = (count, min, max) => Array.from({ length: count }, () => randomValue(min, max));

// --- Chart Initialization ---

// 1. Spend by Business Category (Donut Chart)
const spendByCategoryCtx = document.getElementById('spendByCategoryChart').getContext('2d');
const spendByCategoryData = {
    labels: categories.slice(0, 6), // Show top 6 categories
    datasets: [{
        label: 'Spend',
        data: generateRandomData(6, 500000, 3000000), // Random spend values
        backgroundColor: [chartAccent, deepBlue, otherChartColors[0], otherChartColors[1], otherChartColors[2], otherChartColors[3]],
        borderColor: white,
        borderWidth: 2,
        hoverOffset: 4
    }]
};
new Chart(spendByCategoryCtx, { // Use namespaced Chart class
    type: 'doughnut',
    data: spendByCategoryData,
    options: {
        ...commonChartOptions,
         scales: {}, // Remove scales for doughnut
        plugins: {
             ...commonChartOptions.plugins, // Keep common plugins
             tooltip: { // Override tooltip for percentage
                ...commonChartOptions.plugins.tooltip,
                 callbacks: {
                    label: function(context) {
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const value = context.parsed;
                        const percentage = ((value / total) * 100).toFixed(1);
                        let label = context.label || '';
                        if (label) {
                           label += ': ';
                        }
                        label += ` QAR ${value.toLocaleString()} (${percentage}%)`;
                        return label;
                    },
                    title: function(context) { // Don't show title, label includes it
                        return '';
                    }
                }
             }
        }
    }
});

// 2. Top 5 Suppliers by Spend (Bar Chart - Horizontal)
const topSuppliersCtx = document.getElementById('topSuppliersChart').getContext('2d');
const topSuppliersData = {
    labels: suppliers,
    datasets: [{
        label: 'Total Spend (QAR)',
        data: generateRandomData(5, 1000000, 5000000).sort((a, b) => b - a), // Sorted spend
        backgroundColor: chartAccent,
        borderColor: deepBlue,
        borderWidth: 1,
        barThickness: 25,
    }]
};
new Chart(topSuppliersCtx, { // Use namespaced Chart class
    type: 'bar',
    data: topSuppliersData,
    options: {
        ...commonChartOptions,
        indexAxis: 'y', // Make it horizontal
        scales: {
             y: { // Supplier names
                grid: { display: false },
                ticks: { color: textColor } // Ensure labels are visible
             },
             x: { // Spend values (now the X axis)
                 beginAtZero: true,
                 grid: { color: '#eee' },
                 // Use the common X axis tick formatter which handles horizontal bars
                 ticks: commonChartOptions.scales.x.ticks
             }
        },
        plugins: {
            ...commonChartOptions.plugins,
            tooltip: { // Custom tooltip to add tender count (dummy)
                ...commonChartOptions.plugins.tooltip,
                callbacks: {
                     ...commonChartOptions.plugins.tooltip.callbacks, // Keep default title etc.
                    label: function(context) {
                        const spend = context.parsed.x;
                        const tendersWon = randomValue(5, 25); // Dummy tender count
                        return ` Spend: QAR ${spend.toLocaleString()} | Tenders: ${tendersWon}`;
                    }
                }
            },
            legend: { display: false } // Hide legend for single dataset bar
        }
    }
});

// 3. Spend by Department (Stacked Bar Chart - Example)
const spendByDepartmentCtx = document.getElementById('spendByDepartmentChart').getContext('2d');
const spendByDepartmentData = {
    labels: departments,
    datasets: [
        {
            label: 'IT Spend', // Example sub-category 1
            data: generateRandomData(departments.length, 200000, 1500000),
            backgroundColor: chartAccent,
        },
        {
            label: 'Broadcast Spend', // Example sub-category 2
            data: generateRandomData(departments.length, 300000, 2000000),
            backgroundColor: deepBlue,
        },
         {
            label: 'Other Services', // Example sub-category 3
            data: generateRandomData(departments.length, 100000, 800000),
            backgroundColor: otherChartColors[0],
        }
    ]
};
new Chart(spendByDepartmentCtx, { // Use namespaced Chart class
    type: 'bar',
    data: spendByDepartmentData,
    options: {
        ...commonChartOptions,
        scales: {
            x: { stacked: true, grid: { display: false } }, // Stack bars horizontally
            y: { // Use common Y axis options (already handles K/M formatting)
                 ...commonChartOptions.scales.y,
                 stacked: true
            }
        },
         plugins: {
            ...commonChartOptions.plugins,
            tooltip: { // Use default tooltip label formatter (handles QAR prefix)
                 ...commonChartOptions.plugins.tooltip,
                 callbacks: {
                     ...commonChartOptions.plugins.tooltip.callbacks // Inherit default formatter
                 }
            }
         }
    }
});

// 4. Tendered vs Direct Spend (Pie Chart)
const tenderedDirectCtx = document.getElementById('tenderedDirectChart').getContext('2d');
const tenderedDirectData = {
    labels: ['Tendered Spend', 'Direct Spend'],
    datasets: [{
        data: [11400000, 3850800], // Corresponds to 75% / 25% of YTD total
        backgroundColor: [deepBlue, chartAccent],
        borderColor: white,
        borderWidth: 2,
        hoverOffset: 4
    }]
};
new Chart(tenderedDirectCtx, { // Use namespaced Chart class
    type: 'pie',
    data: tenderedDirectData,
    options: {
         ...commonChartOptions,
         scales: {}, // Remove scales for pie
        plugins: {
             ...commonChartOptions.plugins,
             tooltip: { // Override tooltip for percentage
                ...commonChartOptions.plugins.tooltip,
                 callbacks: {
                    label: function(context) {
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const value = context.parsed;
                        const percentage = ((value / total) * 100).toFixed(1);
                         let label = context.label || '';
                        if (label) {
                           label += ': ';
                        }
                        label += ` QAR ${value.toLocaleString()} (${percentage}%)`;
                        return label;
                    },
                     title: function(context) { // Don't show title, label includes it
                         return '';
                    }
                }
             }
        }
    }
});

// 5. Savings Achieved (Line Chart)
const savingsCtx = document.getElementById('savingsChart').getContext('2d');
const savingsData = {
    labels: months, // Representing months of the year/period
    datasets: [
        {
            label: 'Budgeted Spend',
            data: generateRandomData(12, 800000, 1800000), // Example budget
            borderColor: otherChartColors[1],
            backgroundColor: 'transparent',
            tension: 0.3,
            pointBackgroundColor: otherChartColors[1],
            pointRadius: 4,
            borderDash: [5, 5] // Dashed line for budget
        },
        {
            label: 'Actual Spend',
            data: generateRandomData(12, 700000, 1600000), // Example actual, generally lower
            borderColor: deepBlue,
            backgroundColor: 'rgba(0, 33, 71, 0.1)', // Light blue fill
            fill: true,
            tension: 0.3,
             pointBackgroundColor: deepBlue,
             pointRadius: 4
        },
         {
            label: 'Savings Achieved', // Calculated or directly provided
            data: generateRandomData(12, 50000, 250000), // Example savings
            borderColor: primaryAccent,
            backgroundColor: 'transparent',
            tension: 0.3,
             pointBackgroundColor: primaryAccent,
             pointRadius: 4,
             yAxisID: 'ySavings' // Assign to a secondary axis if needed for scale difference
        }
    ]
};
new Chart(savingsCtx, { // Use namespaced Chart class
    type: 'line',
    data: savingsData,
    options: {
        ...commonChartOptions,
        scales: {
            x: { // Use common X axis options
                 ...commonChartOptions.scales.x
            },
            y: { // Keep the primary Y axis for Budgeted/Actual Spend
                 ...commonChartOptions.scales.y, // Inherit common y scale settings (handles K/M)
                 position: 'left',
                 // Optional: Adjust title or label if needed
            },
            ySavings: { // Define the secondary Y axis for Savings
                position: 'right', // Position on the opposite side
                grid: {
                    drawOnChartArea: false, // Only draw grid lines for the primary axis or neither
                },
                beginAtZero: true,
                 ticks: {
                     // Use common Y axis formatter for consistency
                     callback: commonChartOptions.scales.y.ticks.callback,
                     color: primaryAccent // Match label color for clarity
                 }
            }
        }, // End scales
        plugins: {
            ...commonChartOptions.plugins, // Inherit common plugins like tooltip, legend
             tooltip: { // Use default tooltip formatter
                 ...commonChartOptions.plugins.tooltip,
                 callbacks: {
                     ...commonChartOptions.plugins.tooltip.callbacks // Inherit default formatter
                 }
             }
        } // End plugins
    } // End options
}); // End savingsChart

// --- Interactivity (Example: Toggle Switch) ---
const toggle = document.getElementById('view-toggle');
const kpiValues = document.querySelectorAll('.kpi-value[data-qar], .kpi-sub-values span[data-qar]'); // Select elements with QAR data

toggle.addEventListener('change', () => {
    const isPercentView = toggle.checked;
    kpiValues.forEach(el => {
        const qarValue = el.getAttribute('data-qar');
        const percentValue = el.getAttribute('data-percent');

        if (isPercentView && percentValue) {
            el.textContent = percentValue;
            // Potentially adjust parent styling if needed
            if (el.closest('.kpi-tile')?.classList.contains('savings-kpi')) {
                 el.closest('.kpi-tile').querySelector('.kpi-delta').style.display = 'none'; // Hide delta in % view maybe?
            }
        } else {
            el.textContent = qarValue;
             if (el.closest('.kpi-tile')?.classList.contains('savings-kpi')) {
                 el.closest('.kpi-tile').querySelector('.kpi-delta').style.display = 'block'; // Show delta again
            }
        }
    });

    // TODO: Add logic to update charts if they need to toggle between QAR and %
    // This might involve updating chart data/options and calling chart.update()
    // For simplicity, this example only toggles the KPI tiles.
    console.log(`View toggled to: ${isPercentView ? '%' : 'QAR'}`);
});

// TODO: Add functionality for filters and export buttons
// Example: Add event listeners to filter dropdowns to fetch/update data and redraw charts.
// Example: Use a library like jsPDF or SheetJS for export functionality.