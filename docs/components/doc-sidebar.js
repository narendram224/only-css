class DocSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <aside class="sidebar">
                <div class="sidebar-section">
                    <div class="sidebar-title">Getting Started</div>
                    <ul class="sidebar-nav">
                        <li><a href="../index.html" class="active">Introduction</a></li>
                        <li><a href="../index.html#installation">Installation</a></li>
                        <li><a href="../index.html#quick-start">Quick Start</a></li>
                        <li><a href="../index.html#browser-support">Browser Support</a></li>
                    </ul>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-title">Components</div>
                    <ul class="sidebar-nav">
                        <li><a href="components/buttons.html">Buttons</a></li>
                        <li><a href="components/grid.html">Grid System</a></li>
                        <li><a href="components/cards.html">Cards</a></li>
                        <li><a href="components/alerts.html">Alerts</a></li>
                        <li><a href="components/avatars.html">Avatars</a></li>
                        <li><a href="components/badges.html">Badges</a></li>
                        <li><a href="components/progress.html">Progress</a></li>
                        <li><a href="components/toasts.html">Toasts</a></li>
                        <li><a href="components/dialogs.html">Dialogs</a></li>
                        <li><a href="components/dropdowns.html">Dropdowns</a></li>
                        <li><a href="components/accordions.html">Accordions</a></li>
                        <li><a href="components/tabs.html">Tabs</a></li>
                        <li><a href="components/skeletons.html">Skeletons</a></li>
                        <li><a href="components/spinners.html">Spinners</a></li>
                    </ul>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-title">Resources</div>
                    <ul class="sidebar-nav">
                        <li><a href="../index.html">Documentation</a></li>
                        <li><a href="../themes.html">Themes</a></li>
                        <li><a href="https://github.com/narendrakumar/only-css" target="_blank">GitHub</a></li>
                    </ul>
                </div>
            </aside>
        `;
    }
}

customElements.define('doc-sidebar', DocSidebar);
