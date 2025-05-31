class CookieBanner {
    constructor(options = {}) {
        this.options = {
            message: options.message || 'We use cookies to enhance your experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
            acceptAllText: options.acceptAllText || 'Accept All',
            acceptImportantText: options.acceptImportantText || 'Accept Important Only',
            rejectText: options.rejectText || 'Reject All',
            learnMoreText: options.learnMoreText || 'Learn more',
            learnMoreUrl: options.learnMoreUrl || 'https://gdpr.eu/cookies/',
            position: options.position || 'bottom',
            layout: options.layout || 'line',
            theme: options.theme || 'dark',
            autoShow: options.autoShow !== false,
            expireDays: options.expireDays || 365,
            showReject: options.showReject !== false,
            showImportant: options.showImportant !== false,
            onAcceptAll: options.onAcceptAll || null,
            onAcceptImportant: options.onAcceptImportant || null,
            onReject: options.onReject || null,
            ...options
        };

        this.validatePosition();

        this.consentKey = 'cookie_consent';
        this.consentDateKey = 'cookie_consent_date';
        this.bannerElement = null;

        if (this.options.autoShow) {
            this.init();
        }
    }

    validatePosition() {
        const linePositions = ['top', 'bottom'];
        const windowPositions = ['top-left', 'top-right', 'top-middle', 'center-left', 'center-right', 'center-middle', 'bottom-left', 'bottom-right', 'bottom-middle'];

        if (this.options.layout === 'line' && !linePositions.includes(this.options.position)) {
            console.warn(`Invalid position '${this.options.position}' for line layout. Using 'bottom' instead.`);
            this.options.position = 'bottom';
        }

        if (this.options.layout === 'window' && !windowPositions.includes(this.options.position)) {
            console.warn(`Invalid position '${this.options.position}' for window layout. Using 'center-middle' instead.`);
            this.options.position = 'center-middle';
        }
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.checkAndShowBanner();
            });
        } else {
            this.checkAndShowBanner();
        }
    }

    checkAndShowBanner() {
        if (!this.hasValidConsent()) {
            this.createBanner();
            this.showBanner();
        }
    }

    hasValidConsent() {
        const consent = localStorage.getItem(this.consentKey);
        const consentDate = localStorage.getItem(this.consentDateKey);

        if (!consent || !consentDate) return false;

        const consentTimestamp = new Date(consentDate);
        const now = new Date();
        const expireDate = new Date(consentTimestamp.getTime() + (this.options.expireDays * 24 * 60 * 60 * 1000));

        return now < expireDate;
    }

    createBanner() {
        this.bannerElement = document.createElement('div');
        this.bannerElement.id = 'cookie-banner';
        this.bannerElement.className = `cookie-banner-${this.options.layout} cookie-banner-${this.options.position}`;
        this.bannerElement.innerHTML = this.getBannerHTML();

        this.addStyles();
        this.appendToBody();
        this.addEventListeners();
    }

    getBannerHTML() {
        const learnMoreLink = `<a href="${this.options.learnMoreUrl}" target="_blank" rel="noopener" class="cookie-learn-more">${this.options.learnMoreText}</a>`;

        const isWindow = this.options.layout === 'window';
        const closeButton = isWindow ? '<button class="cookie-close" data-action="close">&times;</button>' : '';

        let buttons = `<button class="cookie-btn cookie-accept-all" data-action="accept-all">${this.options.acceptAllText}</button>`;

        if (this.options.showImportant) {
            buttons += `<button class="cookie-btn cookie-accept-important" data-action="accept-important">${this.options.acceptImportantText}</button>`;
        }

        if (this.options.showReject) {
            buttons += `<button class="cookie-btn cookie-reject" data-action="reject">${this.options.rejectText}</button>`;
        }

        return `
            ${closeButton}
            <div class="cookie-banner-content">
                <div class="cookie-message">
                    ${isWindow ? '<h3>Cookie Consent</h3>' : ''}
                    <p>${this.options.message}</p>
                    <p class="cookie-gdpr-link">For more information about GDPR and cookies, ${learnMoreLink}.</p>
                </div>
                <div class="cookie-buttons">
                    ${buttons}
                </div>
            </div>
        `;
    }

    appendToBody() {
        if (document.body) {
            document.body.appendChild(this.bannerElement);
        } else {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(this.bannerElement);
                });
            } else {
                const checkBody = () => {
                    if (document.body) {
                        document.body.appendChild(this.bannerElement);
                    } else {
                        setTimeout(checkBody, 10);
                    }
                };
                checkBody();
            }
        }
    }

    addStyles() {
        if (document.getElementById('cookie-banner-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'cookie-banner-styles';
        styles.textContent = this.getCSS();
        document.head.appendChild(styles);
    }

    getCSS() {
        const isDark = this.options.theme === 'dark';
        const bgColor = isDark ? '#2c3e50' : '#ffffff';
        const textColor = isDark ? '#ffffff' : '#333333';
        const borderColor = isDark ? '#34495e' : '#e9ecef';
        const acceptAllBg = isDark ? '#27ae60' : '#28a745';
        const acceptImportantBg = isDark ? '#3498db' : '#007bff';
        const rejectBg = isDark ? 'transparent' : '#6c757d';
        const rejectBorder = isDark ? '#95a5a6' : '#6c757d';

        return `
            #cookie-banner {
                position: fixed;
                background-color: ${bgColor};
                color: ${textColor};
                border: 2px solid ${borderColor};
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                visibility: hidden;
            }

            #cookie-banner.show {
                opacity: 1;
                visibility: visible;
            }

            /* Line Layout Styles */
            .cookie-banner-line {
                left: 0;
                right: 0;
                padding: 15px 20px;
            }

            .cookie-banner-line.cookie-banner-top {
                top: 0;
                transform: translateY(-100%);
                border-bottom: 2px solid ${borderColor};
                border-top: none;
                border-left: none;
                border-right: none;
            }

            .cookie-banner-line.cookie-banner-bottom {
                bottom: 0;
                transform: translateY(100%);
                border-top: 2px solid ${borderColor};
                border-bottom: none;
                border-left: none;
                border-right: none;
            }

            .cookie-banner-line.show.cookie-banner-top {
                transform: translateY(0);
            }

            .cookie-banner-line.show.cookie-banner-bottom {
                transform: translateY(0);
            }

            /* Window Layout Styles */
            .cookie-banner-window {
                max-width: 500px;
                width: 90%;
                padding: 25px;
                border-radius: 12px;
                border: 2px solid ${borderColor};
                transform: scale(0.8);
            }

            .cookie-banner-window.show {
                transform: scale(1);
            }

            /* Window Position Classes */
            .cookie-banner-window.cookie-banner-top-left {
                top: 20px;
                left: 20px;
                transform-origin: top left;
            }

            .cookie-banner-window.cookie-banner-top-right {
                top: 20px;
                right: 20px;
                transform-origin: top right;
            }

            .cookie-banner-window.cookie-banner-top-middle {
                top: 20px;
                left: 50%;
                transform: translateX(-50%) scale(0.8);
                transform-origin: top center;
            }

            .cookie-banner-window.cookie-banner-center-left {
                top: 50%;
                left: 20px;
                transform: translateY(-50%) scale(0.8);
                transform-origin: center left;
            }

            .cookie-banner-window.cookie-banner-center-right {
                top: 50%;
                right: 20px;
                transform: translateY(-50%) scale(0.8);
                transform-origin: center right;
            }

            .cookie-banner-window.cookie-banner-center-middle {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                transform-origin: center center;
            }

            .cookie-banner-window.cookie-banner-bottom-left {
                bottom: 20px;
                left: 20px;
                transform-origin: bottom left;
            }

            .cookie-banner-window.cookie-banner-bottom-right {
                bottom: 20px;
                right: 20px;
                transform-origin: bottom right;
            }

            .cookie-banner-window.cookie-banner-bottom-middle {
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) scale(0.8);
                transform-origin: bottom center;
            }

            /* Show states for window positions */
            .cookie-banner-window.show.cookie-banner-top-left,
            .cookie-banner-window.show.cookie-banner-bottom-left,
            .cookie-banner-window.show.cookie-banner-bottom-right {
                transform: scale(1);
            }

            .cookie-banner-window.show.cookie-banner-top-middle,
            .cookie-banner-window.show.cookie-banner-bottom-middle {
                transform: translateX(-50%) scale(1);
            }

            .cookie-banner-window.show.cookie-banner-center-left,
            .cookie-banner-window.show.cookie-banner-center-right {
                transform: translateY(-50%) scale(1);
            }

            .cookie-banner-window.show.cookie-banner-center-middle {
                transform: translate(-50%, -50%) scale(1);
            }

            .cookie-banner-window.show.cookie-banner-top-right {
                transform: scale(1);
            }

            /* Backdrop for center-middle only */
            .cookie-banner-window.cookie-banner-center-middle::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: -1;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }

            .cookie-banner-window.cookie-banner-center-middle.show::before {
                opacity: 1;
                pointer-events: all;
            }

            .cookie-close {
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                color: ${textColor};
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .cookie-close:hover {
                opacity: 1;
            }

            .cookie-banner-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }

            .cookie-banner-window .cookie-banner-content {
                flex-direction: column;
                text-align: center;
                gap: 20px;
            }

            .cookie-message {
                flex: 1;
            }

            .cookie-message h3 {
                margin: 0 0 15px 0;
                font-size: 18px;
                font-weight: 600;
            }

            .cookie-message p {
                margin: 0 0 10px 0;
            }

            .cookie-gdpr-link {
                font-size: 12px;
                opacity: 0.8;
                margin-top: 8px;
            }

            .cookie-learn-more {
                color: ${isDark ? '#3498db' : '#007bff'};
                text-decoration: none;
            }

            .cookie-learn-more:hover {
                text-decoration: underline;
            }

            .cookie-buttons {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
                flex-wrap: wrap;
            }

            .cookie-banner-window .cookie-buttons {
                justify-content: center;
                width: 100%;
            }

            .cookie-btn {
                padding: 10px 16px;
                border: 1px solid transparent;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
                white-space: nowrap;
                min-height: 40px;
            }

            .cookie-accept-all {
                background-color: ${acceptAllBg};
                color: white;
                border-color: ${acceptAllBg};
            }

            .cookie-accept-all:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            .cookie-accept-important {
                background-color: ${acceptImportantBg};
                color: white;
                border-color: ${acceptImportantBg};
            }

            .cookie-accept-important:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            .cookie-reject {
                background-color: ${rejectBg};
                color: ${isDark ? '#bdc3c7' : 'white'};
                border-color: ${rejectBorder};
            }

            .cookie-reject:hover {
                opacity: 0.8;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .cookie-banner-line .cookie-banner-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }
                
                .cookie-buttons {
                    justify-content: center;
                    width: 100%;
                }
                
                .cookie-btn {
                    flex: 1;
                    min-width: 100px;
                    max-width: 140px;
                }

                .cookie-banner-window {
                    width: 95%;
                    max-width: none;
                    padding: 20px;
                }

                /* Adjust window positions for mobile */
                .cookie-banner-window.cookie-banner-top-left,
                .cookie-banner-window.cookie-banner-top-right {
                    top: 10px;
                    left: 2.5%;
                    right: auto;
                    transform: scale(0.8);
                }

                .cookie-banner-window.cookie-banner-bottom-left,
                .cookie-banner-window.cookie-banner-bottom-right {
                    bottom: 10px;
                    left: 2.5%;
                    right: auto;
                    transform: scale(0.8);
                }

                .cookie-banner-window.cookie-banner-center-left,
                .cookie-banner-window.cookie-banner-center-right {
                    left: 2.5%;
                    right: auto;
                    transform: translateY(-50%) scale(0.8);
                }

                .cookie-banner-window.show.cookie-banner-top-left,
                .cookie-banner-window.show.cookie-banner-top-right,
                .cookie-banner-window.show.cookie-banner-bottom-left,
                .cookie-banner-window.show.cookie-banner-bottom-right {
                    transform: scale(1);
                }

                .cookie-banner-window.show.cookie-banner-center-left,
                .cookie-banner-window.show.cookie-banner-center-right {
                    transform: translateY(-50%) scale(1);
                }

                .cookie-message h3 {
                    font-size: 16px;
                }

                #cookie-banner {
                    font-size: 13px;
                }

                .cookie-btn {
                    font-size: 13px;
                    padding: 12px 14px;
                }
            }

            @media (max-width: 480px) {
                .cookie-buttons {
                    flex-direction: column;
                }
                
                .cookie-btn {
                    width: 100%;
                    max-width: none;
                }

                .cookie-banner-window {
                    padding: 15px;
                }
            }
        `;
    }

    addEventListeners() {
        const buttons = this.bannerElement.querySelectorAll('[data-action]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                switch(action) {
                    case 'accept-all':
                        this.acceptAll();
                        break;
                    case 'accept-important':
                        this.acceptImportant();
                        break;
                    case 'reject':
                        this.reject();
                        break;
                    case 'close':
                        this.hideBanner();
                        break;
                }
            });
        });

        // Close on backdrop click for center-middle window layout only
        if (this.options.layout === 'window' && this.options.position === 'center-middle') {
            this.bannerElement.addEventListener('click', (e) => {
                if (e.target === this.bannerElement) {
                    this.hideBanner();
                }
            });
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.bannerElement && this.bannerElement.classList.contains('show')) {
                this.hideBanner();
            }
        });
    }

    acceptAll() {
        this.saveConsent('all');
        this.hideBanner();

        if (typeof this.options.onAcceptAll === 'function') {
            this.options.onAcceptAll();
        }

        console.log('All cookies accepted');
    }

    acceptImportant() {
        this.saveConsent('important');
        this.hideBanner();

        if (typeof this.options.onAcceptImportant === 'function') {
            this.options.onAcceptImportant();
        }

        console.log('Important cookies accepted');
    }

    reject() {
        this.saveConsent('rejected');
        this.hideBanner();

        if (typeof this.options.onReject === 'function') {
            this.options.onReject();
        }

        console.log('All cookies rejected');
    }

    saveConsent(type) {
        localStorage.setItem(this.consentKey, type);
        localStorage.setItem(this.consentDateKey, new Date().toISOString());
    }

    showBanner() {
        if (this.bannerElement) {
            setTimeout(() => {
                this.bannerElement.classList.add('show');
            }, 100);
        }
    }

    hideBanner() {
        if (this.bannerElement) {
            this.bannerElement.classList.remove('show');
            setTimeout(() => {
                if (this.bannerElement && this.bannerElement.parentNode) {
                    this.bannerElement.parentNode.removeChild(this.bannerElement);
                }
            }, 300);
        }
    }

    show() {
        if (!this.bannerElement) {
            this.createBanner();
        }
        this.showBanner();
    }

    hide() {
        this.hideBanner();
    }

    getConsent() {
        const consent = localStorage.getItem(this.consentKey);
        return consent;
    }

    hasConsent() {
        return this.getConsent() !== null;
    }

    resetConsent() {
        localStorage.removeItem(this.consentKey);
        localStorage.removeItem(this.consentDateKey);
        console.log('Cookie consent reset');
    }

    destroy() {
        this.hideBanner();
        const styles = document.getElementById('cookie-banner-styles');
        if (styles) {
            styles.parentNode.removeChild(styles);
        }
    }
}

window.CookieBanner = CookieBanner;

window.initCookieBanner = function(options = {}) {
    return new CookieBanner(options);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieBanner;
}
