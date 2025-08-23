// Handles progress tracker interaction
import { handleStageClick } from './ui-handlers.js';

export function setupProgressTracker() {
    document.querySelectorAll('.stage').forEach(stage => {
        stage.addEventListener('click', handleStageClick);
    });
}