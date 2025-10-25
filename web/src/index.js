/**
 * Web component for displaying YouTube tutorial videos inline in ChatGPT
 */

class TutorialVideoPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const videoId = this.getAttribute('video-id');
    const title = this.getAttribute('title') || 'Tutorial Video';
    const description = this.getAttribute('description') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 16px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .video-container {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .video-header {
          margin-bottom: 12px;
        }

        .video-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .video-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
          border-radius: 8px;
          background: #000;
        }

        .video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .video-link {
          margin-top: 8px;
          font-size: 12px;
        }

        .video-link a {
          color: #2563eb;
          text-decoration: none;
        }

        .video-link a:hover {
          text-decoration: underline;
        }
      </style>

      <div class="video-container">
        ${title || description ? `
          <div class="video-header">
            ${title ? `<h3 class="video-title">${this.escapeHtml(title)}</h3>` : ''}
            ${description ? `<p class="video-description">${this.escapeHtml(description)}</p>` : ''}
          </div>
        ` : ''}

        <div class="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/${videoId}?rel=0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>

        <div class="video-link">
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </div>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Register the custom element
customElements.define('tutorial-video-player', TutorialVideoPlayer);

// Export for module usage
export { TutorialVideoPlayer };
