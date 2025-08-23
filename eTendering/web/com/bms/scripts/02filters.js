// Handles filter bar and events
import { applyFilters } from './ui-handlers.js';

export function setupFilterEvents() {
    const applyFiltersButton = document.getElementById('apply-filters');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFilters);
    }
}

