class DocHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="header">
                <a href="../index.html" class="logo">Only-CSS</a>
                <nav class="header-nav">
                    <a href="../index.html">Home</a>
                    <a href="#examples">Examples</a>
                    <a href="#api">API</a>
                    <a href="https://github.com/narendrakumar/only-css" target="_blank">GitHub</a>
                </nav>
            </header>
        `;
    }
}

customElements.define('doc-header', DocHeader);
