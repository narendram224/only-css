// Global tracking so we don't load Prism multiple times on the same page
let isPrismLoading = false;
const elementsToHighlight = [];

class CodeBlock extends HTMLElement {
    connectedCallback() {
        setTimeout(() => {
            if (this.querySelector('.code-wrapper')) return;

            const language = this.getAttribute('language') || 'html';
            let rawContent = this.innerHTML;

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
            
            // Call our new dynamic loader instead of assuming Prism is there
            this.loadAndHighlight(this.querySelector('code'));
        }, 0);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadAndHighlight(codeElement) {
        // 1. If Prism is already fully loaded, just highlight immediately
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(codeElement);
            return;
        }

        // 2. Add this element to the queue to be highlighted later
        elementsToHighlight.push(codeElement);

        // 3. If we are already fetching Prism, don't fetch it again
        if (isPrismLoading) return;
        isPrismLoading = true;

        // Inject the Prism CSS
        if (!document.querySelector('link[href*="prism"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
            document.head.appendChild(link);
        }

        // Inject the Prism Core JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
        
        script.onload = () => {
            // Once Core is loaded, inject the HTML/Markup language support
            const markupScript = document.createElement('script');
            markupScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js';
            
            markupScript.onload = () => {
                // Prism is fully ready! Highlight everything in the queue
                elementsToHighlight.forEach(el => Prism.highlightElement(el));
                elementsToHighlight.length = 0; // Clear the queue
            };
            
            document.head.appendChild(markupScript);
        };
        
        document.head.appendChild(script);
    }
}

// Global copy function (unchanged)
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