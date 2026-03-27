class DocLayout extends HTMLElement {
    connectedCallback() {
        // Wait for the browser to finish parsing the children inside <doc-layout>
        setTimeout(() => {
            // Check if we've already wrapped the content (prevents infinite loops)
            if (this.querySelector('.layout')) return;

            // 1. Grab all the HTML the user wrote inside the tag
            const pageContent = this.innerHTML;

            // 2. Rewrite the HTML, injecting the content where the slot used to be
            this.innerHTML = `
                <div class="layout">
                    <doc-sidebar></doc-sidebar>
                    <main class="main-content">
                        <div class="content-wrapper">
                            ${pageContent}
                        </div>
                    </main>
                </div>
            `;
        }, 0);
    }
}

customElements.define('doc-layout', DocLayout);