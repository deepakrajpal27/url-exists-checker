class UrlChecker {
    constructor() {
        this.inputElement = document.getElementById('urlInput');
        this.resultElement = document.getElementById('result');
        this.checkTimeout = null;
        this.THROTTLE_DELAY = 500;

        this.initialize();
    }

    initialize() {
        this.inputElement.addEventListener('input', () => this.handleUrlInput());
    }

    handleUrlInput() {
        const url = this.inputElement.value.trim();
    
        if (!url) {
            this.displayResult('Please enter a URL', 'invalid');
            return;
        }

        if (!this.isValidUrlFormat(url)) {
            this.displayResult('Invalid URL format', 'invalid');
            return;
        }

        this.throttleExistenceCheck(url);
    }
    
    isValidUrlFormat(url) {
        const urlComponents = {
            protocol: /^(http:\/\/|https:\/\/)/i,
            domain: /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,6})+/,
            path: /^[a-zA-Z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;=]*$/
        };

        let urlToCheck = url;
        if (!urlComponents.protocol.test(url)) {
            urlToCheck = 'https://' + url;
        }


        if (!urlComponents.protocol.test(urlToCheck)) {
            console.log('missing valid protocol');
            return false;
        }

        const withoutProtocol = urlToCheck.replace(urlComponents.protocol, '');
        
        const [domain, ...pathParts] = withoutProtocol.split('/');
        const path = pathParts.join('/');

        return urlComponents.domain.test(domain) && 
            (!path || urlComponents.path.test(path));
    }


    throttleExistenceCheck(url) {
        if (this.checkTimeout) {
            clearTimeout(this.checkTimeout);
        }

        this.checkTimeout = setTimeout(() => {
            this.checkUrlExistence(url);
        }, this.THROTTLE_DELAY);
    }

    async checkUrlExistence(url) {
        this.displayResult('Checking URL...', 'checking');

        try {
            const response = await this.mockServerCheck(url);
            
            if (response.exists) {
                this.displayResult(
                    `URL exists! Type: ${response.type}`,
                    'valid'
                );
            } else {
                this.displayResult('URL does not exist', 'invalid');
            }
        } catch (error) {
            this.displayResult('Error checking URL', 'invalid');
        }
    }

    async mockServerCheck() {
        const delay = 200 + Math.random() * 600;
        await new Promise(resolve => setTimeout(resolve, delay));

        const exists = Math.random() > 0.3;
        const type = Math.random() > 0.5 ? 'file' : 'folder';

        return {
            exists,
            type: exists ? type : null
        };
    }

    displayResult(message, status) {
        this.resultElement.textContent = message;
        this.resultElement.className = `result ${status}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UrlChecker();
});