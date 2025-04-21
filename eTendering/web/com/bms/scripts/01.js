document.addEventListener('DOMContentLoaded', () => {
    // --- User Info Update ---
    const userNameEl = document.getElementById('user-name');
    const userRoleEl = document.getElementById('user-role');
    const lastLoginEl = document.getElementById('last-login');

    // Dummy user data (replace with actual data fetch later)
    const userData = {
        name: 'Fatima Ahmed',
        role: 'Procurement Lead',
        lastLogin: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
    };

    if (userNameEl) userNameEl.textContent = userData.name;
    if (userRoleEl) userRoleEl.textContent = userData.role;
    if (lastLoginEl) lastLoginEl.textContent = formatDate(userData.lastLogin);

    function formatDate(date) {
        // Simple date formatter
        return date.toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    }

    // --- Sidebar Toggle ---
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('filter-sidebar');
    const mainContent = document.querySelector('.main-content'); // To potentially add overlay or disable clicks

    if (openSidebarBtn && closeSidebarBtn && sidebar) {
        openSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            // Optional: Add an overlay or disable main content clicks
            if (mainContent) mainContent.style.pointerEvents = 'none'; // Basic example
            if (mainContent) mainContent.style.opacity = '0.5'; // Basic example
        });

        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
             // Optional: Remove overlay/enable main content clicks
            if (mainContent) mainContent.style.pointerEvents = 'auto';
            if (mainContent) mainContent.style.opacity = '1';
        });

        // Close sidebar if clicking outside of it (optional)
        document.addEventListener('click', (event) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== openSidebarBtn) {
                closeSidebarBtn.click(); // Trigger the close button's click handler
            }
        });
    }

    // --- Future Enhancements ---
    // Add event listeners for filter changes
    // Fetch and populate widget data dynamically
    // Implement actual filtering logic
});

