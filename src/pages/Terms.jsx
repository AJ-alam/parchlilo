import React from 'react';
import '../styles/Terms.css';

export default function Terms() {
  return (
    <div className="legal-container">
      <div className="legal-card">
        <div className="legal-header">
          <h1 className="legal-title">Terms &amp; Conditions</h1>
          <span className="legal-date">Last Updated: July 8, 2026</span>
        </div>

        <div className="legal-body">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing, browsing, or using the Parchilo invoice management tool and insights blog platform, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree to these terms, you are prohibited from using or accessing this site.</p>

          <h3>2. Client-side Processing &amp; Data Storage</h3>
          <p>Parchilo processes and stores invoice documents entirely on your local device using browser Storage arrays (such as LocalStorage and IndexedDB). You acknowledge and agree that:</p>
          <ul>
            <li>We do not store your invoices on external database servers.</li>
            <li>Clearing your browser cache, storage database, or utilizing private browsing modes (Incognito) will permanently delete your invoices.</li>
            <li>You are solely responsible for printing or saving your invoices as PDFs to back up your billing records.</li>
          </ul>

          <h3>3. Intellectual Property Rights</h3>
          <p>All tech articles, illustrations, mockups, custom SVG graphics, and textual assets published on Parchilo are the intellectual property of Nexaura Technologies, unless noted otherwise. However, to foster learning and developer support:</p>
          <ul>
            <li>Any code snippets, formulas, or configurations shared inside blog articles are licensed under the MIT License and may be used in personal or commercial projects.</li>
            <li>Redistribution or republishing of complete tech articles or design layouts without explicit consent is strictly prohibited.</li>
          </ul>

          <h3>4. Use License</h3>
          <p>Permission is granted to temporarily utilize the interactive invoice builder on Parchilo's website for personal or commercial billing generation. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>Modify or copy the core web platform source code.</li>
            <li>Attempt to decompile or reverse engineer any scripts running on the platform.</li>
            <li>Use the tool or its design to launch a competing online invoice simulation service.</li>
          </ul>

          <h3>5. Disclaimer of Liability</h3>
          <p>The materials, calculators, and parser simulations on Parchilo's website are provided on an 'as is' basis. Nexaura Technologies makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>
          <p>Further, Nexaura Technologies does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of invoice layouts for official tax filings (such as FBR compliance audits).</p>
        </div>
      </div>
    </div>
  );
}
