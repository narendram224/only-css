class CodeBlock extends HTMLElement {
    connectedCallback() {
        // Defer execution until the browser finishes parsing the children inside this tag
        setTimeout(() => {
            // Prevent infinite loops if another script (like doc-layout) rewrites the DOM
            if (this.querySelector('.code-wrapper')) return;

            const language = this.getAttribute('language') || 'html';
            
            // Grab the raw HTML/text inside the tag
            let rawContent = this.innerHTML;

            // Clean up formatting (removes extra blank lines and aligns indentation)
            let lines = rawContent.split('\n');
            if (lines.length > 0 && lines[0].trim() === '') lines.shift();
            if (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
            
            let minIndent = Infinity;
            lines.forEach(line => {
                if (line.trim().length > 0) {
                    let indent = line.match(/^\s*/)[0].length;
                    if (indent < minIndent) minIndent = indent;
                }
            });
            
            const cleanCode = lines.map(line => line.substring(minIndent)).join('\n');
            
            this.innerHTML = `
                <div class="code-wrapper">
                    <div class="code-header">
                        <span class="code-lang">${language.toUpperCase()}</span>
                        <button class="copy-btn" onclick="copyCode(this)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                        </button>
                    </div>
                    <pre><code class="language-${language}">${this.escapeHtml(cleanCode)}</code></pre>
                </div>
            `;
            
            // Trigger Prism highlighting
            if (typeof Prism !== 'undefined') {
                Prism.highlightElement(this.querySelector('code'));
            }
        }, 0);
    }

    escapeHtml(text) {
        // Safely handles both raw HTML (<button>) and already-escaped HTML (&lt;button&gt;)
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global copy function
function copyCode(button) {
    const codeElement = button.closest('.code-wrapper').querySelector('code');
    const text = codeElement.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const originalText = button.innerHTML;
        button.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    });
}

customElements.define('code-block', CodeBlock);