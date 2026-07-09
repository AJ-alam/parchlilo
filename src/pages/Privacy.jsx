import React from 'react';
import '../styles/Privacy.css';

export default function Privacy() {
  return (
    <div className="legal-container">
      <div className="legal-card">
        <div className="legal-header">
          <h1 className="legal-title">Privacy Policy</h1>
          <span className="legal-date">Last Updated: July 8, 2026</span>
        </div>

        <div className="legal-body">
          <h3>1. Data Ownership &amp; Privacy Absolute</h3>
          <p>Your privacy is our utmost priority. Unlike typical financial websites, Parchilo does not store your invoice history, billing lists, organization items, or client details on cloud databases. The entire invoice builder platform is structured to process data locally within your browser's sandboxed memory context.</p>

          <h3>2. File Security and Local Processing</h3>
          <p>When you select, drop, or drag a Purchase Order image or PDF into the 'AI Extract' simulation parser zone:</p>
          <ul>
            <li>The file processing, reading, and line table field mapping are emulated client-side inside the browser.</li>
            <li>The actual file is never transmitted or uploaded to a cloud server.</li>
            <li>No machine learning models on remote servers ingest your private financial records.</li>
          </ul>

          <h3>3. Local Browser Storage usage</h3>
          <p>We use browser database arrays (such as <code>localStorage</code>) to maintain and save your invoice history across page refreshes and active sessions. This allows you to close the tab and return later to access your lists. However, since the database is strictly local to your machine, we cannot sync or retrieve your records if you clear browser caches or access the site from another device.</p>

          <h3>4. Email Newsletter Subscriptions</h3>
          <p>If you choose to subscribe to our 'Parchilo Insights' newsletter inside the home page or blog detail pages, we collect and store your email address. Rest assured that:</p>
          <ul>
            <li>We only use your email to send tech articles, engineering guides, and company news.</li>
            <li>We do not share, lease, or sell your subscription data to marketing brokers or third-party networks.</li>
            <li>An unsubscribe link is provided in the footer of every email to opt-out instantly.</li>
          </ul>

          <h3>5. Contact Inquiries</h3>
          <p>Any query or message you submit via our standalone 'Contact Us' page is simulated locally in browser states, or processed strictly to resolve your immediate corporate consulting inquiry. We do not use contact form submissions for general tracking or profiles building.</p>
        </div>
      </div>
    </div>
  );
}
