import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle, Printer, X, Search, Trash2, Plus, Eye, Loader, HelpCircle } from 'lucide-react';
import '../styles/Home.css';

// Prepopulate database with mock data if empty
const mockInvoices = [
  {
    id: "inv_1",
    invoiceNum: "INV-2026-001",
    clientName: "COMSATS University Islamabad",
    clientEmail: "info@comsats.edu.pk",
    date: "2026-07-08",
    currency: "₨",
    taxRate: 5,
    items: [
      { name: "Sony ZV-E10 Camera vlogger kit", qty: 1, price: 210000 },
      { name: "Professional heavy-duty Tripod Stand", qty: 2, price: 8500 }
    ],
    status: "paid"
  },
  {
    id: "inv_2",
    invoiceNum: "INV-2026-002",
    clientName: "Nexaura Techs Ltd",
    clientEmail: "billing@nexauratechs.com",
    date: "2026-07-07",
    currency: "$",
    taxRate: 15,
    items: [
      { name: "Enterprise API Subscription (Quarterly)", qty: 1, price: 600 },
      { name: "Technical Consulting Hours", qty: 4, price: 120 }
    ],
    status: "pending"
  }
];

export default function Home() {
  // Invoice state
  const [invoices, setInvoices] = useState([]);
  
  // Parser simulation state
  const [parsing, setParsing] = useState(false);
  const [parserStep, setParserStep] = useState(0);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Modal state
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // File input ref
  const fileInputRef = useRef(null);

  // Load invoices on component mount
  useEffect(() => {
    const stored = localStorage.getItem('parchilo_invoices');
    if (stored) {
      setInvoices(JSON.parse(stored));
    } else {
      setInvoices(mockInvoices);
      localStorage.setItem('parchilo_invoices', JSON.stringify(mockInvoices));
    }
  }, []);

  // Helper to save to localStorage
  const saveInvoices = (newInvoices) => {
    setInvoices(newInvoices);
    localStorage.setItem('parchilo_invoices', JSON.stringify(newInvoices));
  };

  // Helper for toast alert
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Drag and Drop Parsing Simulation
  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateParsing(files[0].name);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      simulateParsing(files[0].name);
    }
  };

  const simulateParsing = (fileName) => {
    setParsing(true);
    setParserStep(1);

    // Step 1: Layout reading
    setTimeout(() => {
      setParserStep(2);
    }, 1000);

    // Step 2: Org details
    setTimeout(() => {
      setParserStep(3);
    }, 2000);

    // Step 3: Item mapping
    setTimeout(() => {
      setParserStep(4);
    }, 3000);

    // Step 4: Finished
    setTimeout(() => {
      // Mock extracted details based on file name
      let extClient = "UET Lahore Campus";
      let extEmail = "procurement@uet.edu.pk";
      let extInvNum = "INV-2026-" + Math.floor(100 + Math.random() * 900);
      let extItems = [
        { name: "Vite 5 Development Hosting Server License", qty: 2, price: 45000 },
        { name: "FBR GST Consultancy Service fee", qty: 1, price: 15000 }
      ];

      if (fileName.toLowerCase().includes('scanned') || fileName.toLowerCase().includes('pdf')) {
        extClient = "Standard Chartered Pakistan";
        extEmail = "finance@sc.com.pk";
        extItems = [
          { name: "Commercial Office Paper Packs A4", qty: 10, price: 1800 },
          { name: "Premium Network Router Linksys v2", qty: 1, price: 89000 },
          { name: "Installation & setup services", qty: 1, price: 12000 }
        ];
      }

      const parsedInv = {
        id: 'inv_' + Date.now(),
        invoiceNum: extInvNum,
        clientName: extClient,
        clientEmail: extEmail,
        date: new Date().toISOString().split('T')[0],
        currency: "₨",
        taxRate: 17,
        items: extItems,
        status: 'pending'
      };

      const updated = [parsedInv, ...invoices];
      saveInvoices(updated);
      triggerToast("Invoice auto-extracted successfully!");
      setParsing(false);
      setParserStep(0);
      
      // Open preview modal
      setPreviewInvoice(parsedInv);
      setIsModalOpen(true);
    }, 4200);
  };

  // Print Invoice handler
  const handlePrint = () => {
    window.print();
  };

  // Helper for formatting currencies
  const formatCurrencyValue = (amount, currency) => {
    if (currency === '$' || currency === '€') {
      return currency + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return currency + amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  return (
    <div>
      {/* ══ HERO SECTION ══ */}
      <section className="hero">
        <div className="hero-accent"></div>
        <div className="hero-inner">
          
          {/* Hero Dark Card containing Upload zone */}
          <div className="hero-card">
            <div className="card-content">
              {!parsing ? (
                <div 
                  className="drop-zone" 
                  id="dropZone" 
                  style={{ padding: '60px 20px' }}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('dragover');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('dragover');
                  }}
                  onDrop={handleFileDrop}
                >
                  <div className="dz-icon-wrap">
                    <UploadCloud size={24} />
                  </div>
                  <div className="dz-title">Click or drag file here</div>
                  <div className="dz-desc">PDF, PNG, JPEG, or WebP</div>
                  <div className="dz-subtext">File items will be parsed into invoices dynamically</div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }} 
                    accept=".pdf, image/*"
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <div className="parsing-loader" style={{ display: 'flex' }}>
                  <div className="loader-title">
                    <div className="spinner"></div>
                    AI Parser Simulation Running...
                  </div>
                  <div className="parsing-steps">
                    <div className={`parsing-step ${parserStep === 1 ? 'active' : parserStep > 1 ? 'done' : ''}`}>
                      {parserStep === 1 ? <Loader className="spinner" size={14} /> : parserStep > 1 ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #718096'}} />}
                      <span>Reading document layout...</span>
                    </div>
                    <div className={`parsing-step ${parserStep === 2 ? 'active' : parserStep > 2 ? 'done' : ''}`}>
                      {parserStep === 2 ? <Loader className="spinner" size={14} /> : parserStep > 2 ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #718096'}} />}
                      <span>Extracting client and org fields...</span>
                    </div>
                    <div className={`parsing-step ${parserStep === 3 ? 'active' : parserStep > 3 ? 'done' : ''}`}>
                      {parserStep === 3 ? <Loader className="spinner" size={14} /> : parserStep > 3 ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #718096'}} />}
                      <span>Mapping line item tables...</span>
                    </div>
                    <div className={`parsing-step ${parserStep === 4 ? 'active' : parserStep > 4 ? 'done' : ''}`}>
                      {parserStep === 4 ? <Loader className="spinner" size={14} /> : parserStep > 4 ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #718096'}} />}
                      <span>Adding invoice to ledger database...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title Info Copy */}
          <div>
            <div className="hero-badge">
              <div className="badge-dot"></div>
              No registration required
            </div>
            <h1 className="hero-h">
              Free Online<br />
              <span className="line-block">Invoice Generator</span><br />
              &amp; AI Reader.
            </h1>
            <p className="hero-p">
              Create a structured invoice instantly. Upload any purchase order to extract billing details using our client-side parser, or build invoices manually.
            </p>

            <ul className="hero-features">
              <li><CheckCircle size={18} /> Create invoice links instantly</li>
              <li><CheckCircle size={18} /> No account or signup needed</li>
              <li><CheckCircle size={18} /> Clean, professional A4 print templates</li>
              <li><CheckCircle size={18} /> PDF, PNG, JPEG, WebP supported</li>
            </ul>

            <p style={{ fontSize: '13.5px', color: 'var(--muted)', fontWeight: 500, marginTop: '20px', textAlign: 'left' }}>
              Perfect for freelancers, expense tracking, and instant billing.
            </p>
          </div>

        </div>
      </section>

      {/* Toast Notification */}
      <div className={`toast ${showToast ? 'show' : ''}`} id="toastMessage">
        <CheckCircle size={16} />
        <span>{toastMessage}</span>
      </div>

      {/* A4 Invoice Preview Modal */}
      {isModalOpen && previewInvoice && (
        <div className="modal-overlay open" onClick={(e) => {
          if (e.target.className.includes('modal-overlay')) {
            setIsModalOpen(false);
          }
        }}>
          <div className="modal-container">
            <div className="modal-header">
              <h3>Invoice Preview</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <div className="invoice-a4-wrap">
                <div className="invoice-a4" id="a4Content">
                  
                  <div className="a4-header">
                    <div>
                      <div className="a4-logo">PAR<span className="a4-logo-invert">CHI</span>LO</div>
                      <p style={{ marginTop: '4px', fontWeight: 500, fontSize: '11px', color: 'var(--dim)' }}>
                        Nexaura Technologies Partner
                      </p>
                    </div>
                    <div className="a4-meta-col">
                      <div className="a4-meta-title">Invoice</div>
                      <p style={{ color: 'var(--dim)', fontSize: '11px' }}>Processed locally</p>
                    </div>
                  </div>

                  <div className="a4-bill-row">
                    <div className="a4-bill-col">
                      <h5>Billed From</h5>
                      <strong>Parchilo Services Ltd</strong>
                      <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                        Plot 45, Sector I-10/3<br />
                        Islamabad, Pakistan<br />
                        GST: GST-9988112-2<br />
                        NTN: 8877112-0
                      </p>
                    </div>
                    <div className="a4-bill-col">
                      <h5>Billed To</h5>
                      <strong>{previewInvoice.clientName}</strong>
                      <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                        {previewInvoice.clientEmail || 'No Billing Email'}<br />
                        Islamabad, Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="a4-bill-row" style={{ marginBottom: '32px' }}>
                    <div className="a4-bill-col">
                      <h5>Invoice Metadata</h5>
                      <div className="a4-meta-grid">
                        <label>Invoice Number:</label> <span>{previewInvoice.invoiceNum}</span>
                        <label>Issue Date:</label> <span>{previewInvoice.date}</span>
                        <label>Payment Terms:</label> <span>Due on Receipt</span>
                      </div>
                    </div>
                    <div className="a4-bill-col">
                      <h5>Status</h5>
                      <span style={{ 
                        fontWeight: 900, 
                        textTransform: 'uppercase', 
                        fontSize: '14px', 
                        color: previewInvoice.status === 'paid' ? 'var(--green)' : 'var(--amber)' 
                      }}>
                        {previewInvoice.status}
                      </span>
                    </div>
                  </div>

                  <table className="a4-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50%' }}>Description</th>
                        <th style={{ width: '10%', textAlign: 'right' }}>Qty</th>
                        <th style={{ width: '20%', textAlign: 'right' }}>Unit Price</th>
                        <th style={{ width: '20%', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewInvoice.items.map((item, i) => {
                        const itemSub = item.qty * item.price;
                        return (
                          <tr key={i}>
                            <td>{item.name}</td>
                            <td style={{ textAlign: 'right' }}>{item.qty}</td>
                            <td style={{ textAlign: 'right' }}>{formatCurrencyValue(item.price, previewInvoice.currency)}</td>
                            <td style={{ textAlign: 'right', fontWeight: 700 }}>
                              {formatCurrencyValue(itemSub, previewInvoice.currency)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Calculations */}
                  {(() => {
                    const itemSubtotal = previewInvoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
                    const itemTax = itemSubtotal * (previewInvoice.taxRate / 100);
                    const itemTotal = itemSubtotal + itemTax;

                    return (
                      <div className="a4-total-grid">
                        <label>Subtotal:</label> <span>{formatCurrencyValue(itemSubtotal, previewInvoice.currency)}</span>
                        <label>Tax Rate ({previewInvoice.taxRate}%):</label> <span>{formatCurrencyValue(itemTax, previewInvoice.currency)}</span>
                        <label className="grand-total-label">Grand Total:</label> 
                        <span className="grand-total-val">{formatCurrencyValue(itemTotal, previewInvoice.currency)}</span>
                      </div>
                    );
                  })()}

                  <div className="a4-footer">
                    <p>Thank you for your business. For invoice questions, please contact billing@parchilo.com</p>
                    <p style={{ marginTop: '6px', fontSize: '9px', color: 'var(--xdim)' }}>
                      Generated by Parchilo Invoice System. Secure client-side ledger.
                    </p>
                  </div>

                </div>
              </div>
            </div>
            <div className="modal-footer-actions">
              <button className="btn-modal-action" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-modal-action primary" onClick={handlePrint}>
                <Printer size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> 
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
