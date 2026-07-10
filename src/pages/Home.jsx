import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle, Printer, X, Search, Trash2, Plus, Eye, Loader, HelpCircle } from 'lucide-react';
import '../styles/Home.css';

// Encode UTF-8 string to Base64 safely
function safeBtoa(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
}

// Complete world currencies list
const currenciesList = [
  { code: 'PKR', symbol: '₨', name: 'PKR - Pakistani Rupee', decimals: 0 },
  { code: 'USD', symbol: '$', name: 'USD - US Dollar', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'EUR - Euro', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'GBP - British Pound', decimals: 2 },
  { code: 'INR', symbol: '₹', name: 'INR - Indian Rupee', decimals: 2 },
  { code: 'AED', symbol: 'د.إ', name: 'AED - UAE Dirham', decimals: 2 },
  { code: 'SAR', symbol: 'ر.س', name: 'SAR - Saudi Riyal', decimals: 2 },
  { code: 'AUD', symbol: 'A$', name: 'AUD - Australian Dollar', decimals: 2 },
  { code: 'CAD', symbol: 'C$', name: 'CAD - Canadian Dollar', decimals: 2 },
  { code: 'CNY', symbol: '¥', name: 'CNY - Chinese Yuan', decimals: 2 },
  { code: 'JPY', symbol: '¥', name: 'JPY - Japanese Yen', decimals: 0 },
  { code: 'SGD', symbol: 'S$', name: 'SGD - Singapore Dollar', decimals: 2 },
  { code: 'CHF', symbol: 'CHF', name: 'CHF - Swiss Franc', decimals: 2 },
  { code: 'NZD', symbol: 'NZ$', name: 'NZD - New Zealand Dollar', decimals: 2 },
  { code: 'HKD', symbol: 'HK$', name: 'HKD - Hong Kong Dollar', decimals: 2 },
  { code: 'ZAR', symbol: 'R', name: 'ZAR - South African Rand', decimals: 2 },
  { code: 'TRY', symbol: '₺', name: 'TRY - Turkish Lira', decimals: 2 },
  { code: 'RUB', symbol: '₽', name: 'RUB - Russian Ruble', decimals: 2 },
  { code: 'BRL', symbol: 'R$', name: 'BRL - Brazilian Real', decimals: 2 },
  { code: 'MXN', symbol: 'Mex$', name: 'MXN - Mexican Peso', decimals: 2 },
  { code: 'MYR', symbol: 'RM', name: 'MYR - Malaysian Ringgit', decimals: 2 },
  { code: 'IDR', symbol: 'Rp', name: 'IDR - Indonesian Rupiah', decimals: 0 },
  { code: 'PHP', symbol: '₱', name: 'PHP - Philippine Peso', decimals: 2 },
  { code: 'THB', symbol: '฿', name: 'THB - Thai Baht', decimals: 2 },
  { code: 'KRW', symbol: '₩', name: 'KRW - South Korean Won', decimals: 0 },
  { code: 'SEK', symbol: 'kr', name: 'SEK - Swedish Krona', decimals: 2 },
  { code: 'NOK', symbol: 'kr', name: 'NOK - Norwegian Krone', decimals: 2 },
  { code: 'DKK', symbol: 'kr', name: 'DKK - Danish Krone', decimals: 2 },
  { code: 'PLN', symbol: 'zł', name: 'PLN - Polish Zloty', decimals: 2 },
  { code: 'EGP', symbol: 'E£', name: 'EGP - Egyptian Pound', decimals: 2 },
  { code: 'KWD', symbol: 'د.ك', name: 'KWD - Kuwaiti Dinar', decimals: 3 },
  { code: 'QAR', symbol: 'ر.ق', name: 'QAR - Qatari Riyal', decimals: 2 },
  { code: 'OMR', symbol: 'ر.ع', name: 'OMR - Omani Rial', decimals: 3 },
  { code: 'BHD', symbol: 'د.ب', name: 'BHD - Bahraini Dinar', decimals: 3 }
];

// Prepopulate database with mock data if empty
const mockInvoices = [];

export default function Home() {
  // App settings & view tabs
  const [activeTab, setActiveTab] = useState('parser'); // 'parser' or 'builder'

  // Parser simulation state
  const [parsing, setParsing] = useState(false);
  const [parserStep, setParserStep] = useState(0);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Modal preview state
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');

  // File input ref
  const fileInputRef = useRef(null);

  // --- MANUAL BUILDER FORM STATE ---
  const [fromCompany, setFromCompany] = useState('Parchilo Services Ltd');
  const [fromAddress, setFromAddress] = useState("Plot 45, Sector I-10/3\nIslamabad, Pakistan");
  const [fromGst, setFromGst] = useState('GST-9988112-2');
  const [fromNtn, setFromNtn] = useState('8877112-0');
  
  // Company Branding States
  const [logo, setLogo] = useState('');
  const [stamp, setStamp] = useState('');
  const logoInputRef = useRef(null);
  const stampInputRef = useRef(null);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [currency, setCurrency] = useState('PKR');
  const [taxRate, setTaxRate] = useState(17);
  const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  // Set default randomized invoice number on tab mount
  useEffect(() => {
    if (!invoiceNumber && activeTab === 'builder') {
      setInvoiceNumber("INV-2026-" + Math.floor(100 + Math.random() * 900));
    }
  }, [activeTab, invoiceNumber]);

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

    // Step 4: Finished simulation & fill manual builder
    setTimeout(() => {
      let extClient = "UET Lahore Campus";
      let extEmail = "procurement@uet.edu.pk";
      let extAddress = "GT Road, Lahore, Pakistan";
      let extInvNum = "INV-2026-" + Math.floor(100 + Math.random() * 900);
      let extItems = [
        { name: "Vite 5 Development Hosting Server License", qty: 2, price: 45000 },
        { name: "FBR GST Consultancy Service fee", qty: 1, price: 15000 }
      ];

      if (fileName.toLowerCase().includes('scanned') || fileName.toLowerCase().includes('pdf')) {
        extClient = "Standard Chartered Pakistan";
        extEmail = "finance@sc.com.pk";
        extAddress = "SC Tower, I.I. Chundrigar Road, Karachi";
        extItems = [
          { name: "Commercial Office Paper Packs A4", qty: 10, price: 1800 },
          { name: "Premium Network Router Linksys v2", qty: 1, price: 89000 },
          { name: "Installation & setup services", qty: 1, price: 12000 }
        ];
      }

      // Populate builder state with extracted values
      setClientName(extClient);
      setClientEmail(extEmail);
      setClientAddress(extAddress);
      setInvoiceNumber(extInvNum);
      setItems(extItems);
      setTaxRate(17);
      setCurrency("PKR");

      // Swap view to Builder so they can verify/save
      setActiveTab('builder');
      setParsing(false);
      setParserStep(0);

      triggerToast("AI extracted invoice data! Please review and modify before generating.");
    }, 4200);
  };

  // --- COMPRESS & UPLOAD BRANDING IMAGES ---
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max_size = 120; // Keep dimensions tiny to keep Base64 string small
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Output transparent PNG
        const dataUrl = canvas.toDataURL('image/png');
        
        if (type === 'logo') {
          setLogo(dataUrl);
        } else {
          setStamp(dataUrl);
        }
        triggerToast(`${type === 'logo' ? 'Logo' : 'Stamp'} uploaded & compressed!`);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // --- MANUAL FORM ACTIONS ---
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    setLoadingInvoice(true);

    const localId = 'inv_' + Date.now();
    const invoiceData = {
      id: localId,
      invoice_number: invoiceNumber,
      client_name: clientName,
      client_email: clientEmail,
      client_address: clientAddress || "Islamabad, Pakistan",
      date: invoiceDate,
      currency: currency,
      tax_rate: taxRate,
      status: 'pending',
      from_company: fromCompany,
      from_address: fromAddress,
      from_gst: fromGst,
      from_ntn: fromNtn,
      logo: logo || null,
      stamp: stamp || null,
      items: items.map(it => ({ name: it.name, qty: Number(it.qty), price: Number(it.price) }))
    };

    // Save to local cache list in background
    let list = [];
    try {
      const stored = localStorage.getItem('parchilo_invoices');
      if (stored) {
        list = JSON.parse(stored);
      }
    } catch (err) {
      console.error(err);
    }
    const updated = [invoiceData, ...list];
    localStorage.setItem('parchilo_invoices', JSON.stringify(updated));
    
    // Generate URL that embeds the full JSON structure (safe for sharing cross-device)
    const jsonStr = JSON.stringify(invoiceData);
    const link = window.location.origin + "/invoice#data=" + safeBtoa(jsonStr);
    
    setShareableUrl(link);
    setPreviewInvoice(invoiceData);
    setIsModalOpen(true);
    
    triggerToast("Invoice generated and stored in local cache!");
    setLoadingInvoice(false);

    // Clear builder form details (Logo and Stamp persist for convenience)
    setClientName('');
    setClientEmail('');
    setClientAddress('');
    setInvoiceNumber('');
    setItems([{ name: '', qty: 1, price: 0 }]);
  };

  // Print Invoice handler
  const handlePrint = () => {
    window.print();
  };

  // Helper for formatting currencies dynamically
  const formatCurrencyValue = (amount, currencyCode) => {
    const cur = currenciesList.find(c => c.code === currencyCode || c.symbol === currencyCode);
    if (!cur) {
      // Fallback
      return (currencyCode || '$') + amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return cur.symbol + amount.toLocaleString(undefined, { 
      minimumFractionDigits: cur.decimals, 
      maximumFractionDigits: cur.decimals 
    });
  };

  return (
    <div>
      {/* ══ HERO SECTION ══ */}
      <section className="hero">
        <div className="hero-accent"></div>
        <div className="hero-inner">
          
          {/* Hero Dark Card containing Tabbed Upload & Builder */}
          <div className="hero-card">
            <div className="card-content">
              
              {/* Tab selector (Only if not parsing) */}
              {!parsing && (
                <div className="filter-tabs" style={{ marginBottom: '20px', width: 'fit-content' }}>
                  <button 
                    type="button"
                    className={`filter-btn ${activeTab === 'parser' ? 'active' : ''}`}
                    onClick={() => setActiveTab('parser')}
                  >
                    AI Document Reader
                  </button>
                  <button 
                    type="button"
                    className={`filter-btn ${activeTab === 'builder' ? 'active' : ''}`}
                    onClick={() => setActiveTab('builder')}
                  >
                    Manual Invoice Builder
                  </button>
                </div>
              )}

              {parsing ? (
                // Parsing simulation loader
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
                      <span>Formatting values for review...</span>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'parser' ? (
                // Tab 1: AI Document Parser (Drop Zone)
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
                // Tab 2: Manual Invoice Builder Form
                <form className="manual-form" onSubmit={handleGenerateInvoice}>
                  
                  {/* BRANDING SECTION: Logo and Stamp uploads */}
                  <div className="form-row" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <div className="form-group">
                      <label style={{ color: 'var(--lime)', fontSize: '10px' }}>Company Logo</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                        {logo ? (
                          <div style={{ position: 'relative', width: '50px', height: '50px', border: '1px dashed #334155', borderRadius: '6px', overflow: 'hidden', background: '#090d16' }}>
                            <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo Preview" />
                            <button 
                              type="button" 
                              onClick={() => setLogo('')}
                              style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              ref={logoInputRef}
                              style={{ display: 'none' }}
                              onChange={(e) => handleImageUpload(e, 'logo')} 
                            />
                            <button 
                              type="button"
                              onClick={() => logoInputRef.current.click()}
                              className="btn-add-item"
                              style={{ margin: 0, padding: '6px 12px' }}
                            >
                              Upload Logo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label style={{ color: 'var(--lime)', fontSize: '10px' }}>Authorized Stamp</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                        {stamp ? (
                          <div style={{ position: 'relative', width: '50px', height: '50px', border: '1px dashed #334155', borderRadius: '6px', overflow: 'hidden', background: '#090d16' }}>
                            <img src={stamp} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Stamp Preview" />
                            <button 
                              type="button" 
                              onClick={() => setStamp('')}
                              style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              ref={stampInputRef}
                              style={{ display: 'none' }}
                              onChange={(e) => handleImageUpload(e, 'stamp')} 
                            />
                            <button 
                              type="button"
                              onClick={() => stampInputRef.current.click()}
                              className="btn-add-item"
                              style={{ margin: 0, padding: '6px 12px' }}
                            >
                              Upload Stamp
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>From Company</label>
                      <input 
                        type="text" 
                        value={fromCompany} 
                        onChange={(e) => setFromCompany(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Invoice Number</label>
                      <input 
                        type="text" 
                        value={invoiceNumber} 
                        onChange={(e) => setInvoiceNumber(e.target.value)} 
                        placeholder="e.g. INV-2026-001" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>From Address</label>
                    <input 
                      type="text" 
                      value={fromAddress} 
                      onChange={(e) => setFromAddress(e.target.value)} 
                      placeholder="Street Address, City, Country"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>GST / VAT</label>
                      <input 
                        type="text" 
                        value={fromGst} 
                        onChange={(e) => setFromGst(e.target.value)} 
                        placeholder="Tax Registration ID" 
                      />
                    </div>
                    <div className="form-group">
                      <label>NTN</label>
                      <input 
                        type="text" 
                        value={fromNtn} 
                        onChange={(e) => setFromNtn(e.target.value)} 
                        placeholder="NTN Number" 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Client Name</label>
                      <input 
                        type="text" 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)} 
                        placeholder="Client Name" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Client Email</label>
                      <input 
                        type="email" 
                        value={clientEmail} 
                        onChange={(e) => setClientEmail(e.target.value)} 
                        placeholder="client@email.com" 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Client Address</label>
                    <input 
                      type="text" 
                      value={clientAddress} 
                      onChange={(e) => setClientAddress(e.target.value)} 
                      placeholder="Client Billing Address" 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Issue Date</label>
                      <input 
                        type="date" 
                        value={invoiceDate} 
                        onChange={(e) => setInvoiceDate(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-row" style={{ gap: '10px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Currency</label>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                          {currenciesList.map(cur => (
                            <option key={cur.code} value={cur.code}>
                              {cur.code} ({cur.symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Tax Rate (%)</label>
                        <input 
                          type="number" 
                          value={taxRate} 
                          onChange={(e) => setTaxRate(Number(e.target.value))} 
                          min="0" 
                          max="100" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Items</label>
                    <div className="items-table-wrap">
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th style={{ width: '55%' }}>Description</th>
                            <th style={{ width: '15%', textAlign: 'right' }}>Qty</th>
                            <th style={{ width: '22%', textAlign: 'right' }}>Price</th>
                            <th style={{ width: '8%', textAlign: 'center' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <input 
                                  type="text" 
                                  value={item.name} 
                                  onChange={(e) => handleItemChange(idx, 'name', e.target.value)} 
                                  placeholder="Item Name" 
                                  required 
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  className="num-input" 
                                  value={item.qty} 
                                  onChange={(e) => handleItemChange(idx, 'qty', e.target.value)} 
                                  min="1" 
                                  required 
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  className="num-input" 
                                  value={item.price} 
                                  onChange={(e) => handleItemChange(idx, 'price', e.target.value)} 
                                  min="0" 
                                  required 
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {items.length > 1 && (
                                  <button 
                                    type="button" 
                                    className="btn-trash" 
                                    onClick={() => handleRemoveItem(idx)}
                                    style={{ color: '#ef4444' }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      type="button" 
                      className="btn-add-item" 
                      onClick={handleAddItem}
                    >
                      <Plus size={12} /> Add Row
                    </button>
                  </div>

                  {/* Calculations Summary */}
                  {(() => {
                    const subtotal = items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0);
                    const tax = subtotal * (taxRate / 100);
                    const total = subtotal + tax;
                    return (
                      <div className="form-totals" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginTop: '10px' }}>
                        <div>Subtotal: <span>{formatCurrencyValue(subtotal, currency)}</span></div>
                        <div>Tax ({taxRate}%): <span>{formatCurrencyValue(tax, currency)}</span></div>
                        <div style={{ fontSize: '15px', fontWeight: 800 }}>Grand Total: <strong style={{ color: 'var(--lime)' }}>{formatCurrencyValue(total, currency)}</strong></div>
                      </div>
                    );
                  })()}

                  <button 
                    type="submit" 
                    className="btn-submit-invoice" 
                    disabled={loadingInvoice}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {loadingInvoice ? (
                      <>
                        <Loader className="spinner" size={14} /> Generating...
                      </>
                    ) : (
                      "Generate Real Invoice"
                    )}
                  </button>
                </form>
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
              
              {/* Shareable Link Bar */}
              {shareableUrl && (
                <div style={{ 
                  padding: '16px 24px', 
                  background: 'rgba(200, 241, 53, 0.05)', 
                  borderBottom: '1px solid rgba(255,255,255,0.05)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '12px' 
                }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: 'var(--lime)' }}>Shareable Invoice Link</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={shareableUrl} 
                      style={{ 
                        background: '#131b2e', 
                        border: '1px solid #334155', 
                        borderRadius: '6px', 
                        padding: '8px 12px', 
                        fontSize: '12px', 
                        color: '#e2e8f0', 
                        width: '100%', 
                        outline: 'none' 
                      }}
                      onClick={(e) => e.target.select()}
                    />
                  </div>
                  <button 
                    type="button"
                    className="btn-modal-action primary" 
                    style={{ padding: '8px 16px', fontSize: '12px', marginTop: '16px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(shareableUrl);
                      triggerToast("Link copied to clipboard!");
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              )}

              <div className="invoice-a4-wrap">
                <div className="invoice-a4" id="a4Content">
                  
                  <div className="a4-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {previewInvoice.logo ? (
                        <img src={previewInvoice.logo} style={{ maxHeight: '55px', maxWidth: '150px', objectFit: 'contain' }} alt="Company Logo" />
                      ) : (
                        <div>
                          <div className="a4-logo">PAR<span className="a4-logo-invert">CHI</span>LO</div>
                          <p style={{ marginTop: '4px', fontWeight: 500, fontSize: '11px', color: 'var(--dim)' }}>
                            Nexaura Technologies Partner
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="a4-meta-col" style={{ textAlign: 'right' }}>
                      <div className="a4-meta-title">Invoice</div>
                      <p style={{ color: 'var(--dim)', fontSize: '11px' }}>Processed & Verified</p>
                    </div>
                  </div>

                  <div className="a4-bill-row">
                    <div className="a4-bill-col">
                      <h5>Billed From</h5>
                      <strong>{previewInvoice.from_company || 'Parchilo Services Ltd'}</strong>
                      <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                        {previewInvoice.from_address ? (
                          previewInvoice.from_address.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)
                        ) : (
                          <>Plot 45, Sector I-10/3<br />Islamabad, Pakistan</>
                        )}
                        {previewInvoice.from_gst && <><br />GST: {previewInvoice.from_gst}</>}
                        {previewInvoice.from_ntn && <><br />NTN: {previewInvoice.from_ntn}</>}
                      </p>
                    </div>
                    <div className="a4-bill-col">
                      <h5>Billed To</h5>
                      <strong>{previewInvoice.client_name}</strong>
                      <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                        {previewInvoice.client_email && <>{previewInvoice.client_email}<br /></>}
                        {previewInvoice.client_address ? (
                          previewInvoice.client_address.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)
                        ) : (
                          <>Islamabad, Pakistan</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="a4-bill-row" style={{ marginBottom: '32px' }}>
                    <div className="a4-bill-col">
                      <h5>Invoice Metadata</h5>
                      <div className="a4-meta-grid">
                        <label>Invoice Number:</label> <span>{previewInvoice.invoice_number}</span>
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
                        const itemSub = Number(item.qty || 0) * Number(item.price || 0);
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
                    const itemSubtotal = previewInvoice.items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0);
                    const itemTax = itemSubtotal * (Number(previewInvoice.tax_rate || previewInvoice.taxRate || 0) / 100);
                    const itemTotal = itemSubtotal + itemTax;

                    return (
                      <div className="a4-total-grid">
                        <label>Subtotal:</label> <span>{formatCurrencyValue(itemSubtotal, previewInvoice.currency)}</span>
                        <label>Tax Rate ({previewInvoice.tax_rate || previewInvoice.taxRate || 0}%):</label> <span>{formatCurrencyValue(itemTax, previewInvoice.currency)}</span>
                        <label className="grand-total-label">Grand Total:</label> 
                        <span className="grand-total-val">{formatCurrencyValue(itemTotal, previewInvoice.currency)}</span>
                      </div>
                    );
                  })()}

                  {/* Stamp Display */}
                  {previewInvoice.stamp && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '10px', marginRight: '20px' }}>
                      <p style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: '4px' }}>Authorized Stamp</p>
                      <img src={previewInvoice.stamp} style={{ maxHeight: '75px', maxWidth: '120px', objectFit: 'contain' }} alt="Company Stamp" />
                    </div>
                  )}

                  <div className="a4-footer">
                    <p>Thank you for your business. For invoice questions, please contact billing@parchilo.com</p>
                    <p style={{ marginTop: '6px', fontSize: '9px', color: 'var(--xdim)' }}>
                      Generated by Parchilo Invoice System. Secure client-side local cache.
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
