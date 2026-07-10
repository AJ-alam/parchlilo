import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, AlertTriangle, Loader } from 'lucide-react';
import '../styles/Home.css';

// Decode Base64 to UTF-8 string safely
function safeAtob(str) {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    console.error("Decoding error:", e);
    return atob(str);
  }
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

export default function InvoiceView() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = () => {
      // 1. Try decoding Base64 payload from URL hash first
      const hash = window.location.hash;
      if (hash && hash.startsWith('#data=')) {
        try {
          const encoded = hash.substring(6);
          const decoded = safeAtob(encoded);
          const parsed = JSON.parse(decoded);
          if (parsed && parsed.invoice_number && parsed.client_name) {
            setInvoice(parsed);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Failed to decode hash data:", err);
        }
      }

      // 2. Try decoding from query parameters (fallback)
      const params = new URLSearchParams(window.location.search);
      const queryData = params.get('data');
      if (queryData) {
        try {
          const decoded = safeAtob(queryData);
          const parsed = JSON.parse(decoded);
          if (parsed && parsed.invoice_number && parsed.client_name) {
            setInvoice(parsed);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Failed to decode query param data:", err);
        }
      }

      // 3. Try lookup in LocalStorage cache if ID is provided in route
      if (id) {
        try {
          const stored = localStorage.getItem('parchilo_invoices');
          if (stored) {
            const list = JSON.parse(stored);
            const localInv = list.find(i => i.id === id);
            if (localInv) {
              setInvoice(localInv);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error("Local storage lookup failed:", err);
        }
      }

      setError("Invoice not found or shareable URL is corrupt.");
      setLoading(false);
    };

    fetchInvoice();
    
    const handleHashChange = () => {
      setLoading(true);
      fetchInvoice();
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrencyValue = (amount, currencyCode) => {
    const cur = currenciesList.find(c => c.code === currencyCode || c.symbol === currencyCode);
    if (!cur) {
      return (currencyCode || '$') + amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return cur.symbol + amount.toLocaleString(undefined, { 
      minimumFractionDigits: cur.decimals, 
      maximumFractionDigits: cur.decimals 
    });
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text)' }}>
        <Loader className="spinner" size={40} style={{ marginBottom: '20px', color: 'var(--accent)' }} />
        <h3>Loading Invoice Details...</h3>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="view-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text)', textAlign: 'center', padding: '0 20px' }}>
        <AlertTriangle size={48} style={{ color: 'var(--red)', marginBottom: '20px' }} />
        <h3 style={{ fontSize: '22px', fontWeight: 700 }}>Invoice Not Found</h3>
        <p style={{ color: 'var(--muted)', marginTop: '8px', maxWidth: '400px' }}>{error || "The requested invoice URL does not exist or has been deleted."}</p>
        <Link to="/" className="btn-modal-action primary" style={{ marginTop: '24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Homepage
        </Link>
      </div>
    );
  }

  const taxVal = invoice.tax_rate !== undefined ? invoice.tax_rate : (invoice.taxRate !== undefined ? invoice.taxRate : 0);
  const currencyVal = invoice.currency || '₨';
  const itemSubtotal = invoice.items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0);
  const itemTax = itemSubtotal * (Number(taxVal) / 100);
  const itemTotal = itemSubtotal + itemTax;

  return (
    <div className="view-container invoice-view-page" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', color: 'var(--text)' }}>
      {/* Action Header (Hidden during Print) */}
      <div className="invoice-view-actions no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Link to="/" className="btn-back" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
          <ArrowLeft size={16} /> Back to Generator
        </Link>
        
        <button className="btn-modal-action primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}>
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {/* A4 Sheet Container */}
      <div className="invoice-a4-wrap" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)', borderRadius: '12px', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <div className="invoice-a4" id="a4Content" style={{ padding: '50px 40px', background: '#ffffff', color: '#1e293b', width: '100%', maxWidth: '700px', minHeight: '800px', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          
          {/* Header */}
          <div className="a4-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {invoice.logo ? (
                <img src={invoice.logo} style={{ maxHeight: '55px', maxWidth: '150px', objectFit: 'contain' }} alt="Company Logo" />
              ) : (
                <div>
                  <div className="a4-logo" style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '0.5px', color: '#0f172a' }}>PAR<span className="a4-logo-invert" style={{ background: '#0f172a', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', marginLeft: '2px' }}>CHI</span>LO</div>
                  <p style={{ marginTop: '4px', fontWeight: 500, fontSize: '11px', color: '#64748b' }}>
                    Nexaura Technologies Partner
                  </p>
                </div>
              )}
            </div>
            <div className="a4-meta-col" style={{ textAlign: 'right' }}>
              <div className="a4-meta-title" style={{ fontSize: '28px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a' }}>Invoice</div>
              <p style={{ color: '#64748b', fontSize: '11px' }}>Processed & Verified</p>
            </div>
          </div>

          {/* Billing Row */}
          <div className="a4-bill-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '20px' }}>
            <div className="a4-bill-col" style={{ flex: 1 }}>
              <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#2563eb', marginBottom: '8px', letterSpacing: '0.5px', fontWeight: 700 }}>Billed From</h5>
              <strong style={{ color: '#0f172a', fontSize: '14px' }}>{invoice.from_company || 'Parchilo Services Ltd'}</strong>
              <p style={{ marginTop: '6px', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                {invoice.from_address ? (
                  invoice.from_address.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)
                ) : (
                  <>Plot 45, Sector I-10/3<br />Islamabad, Pakistan</>
                )}
                {invoice.from_gst && <><br />GST: {invoice.from_gst}</>}
                {invoice.from_ntn && <><br />NTN: {invoice.from_ntn}</>}
              </p>
            </div>
            <div className="a4-bill-col" style={{ flex: 1 }}>
              <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#2563eb', marginBottom: '8px', letterSpacing: '0.5px', fontWeight: 700 }}>Billed To</h5>
              <strong style={{ color: '#0f172a', fontSize: '14px' }}>{invoice.client_name}</strong>
              <p style={{ marginTop: '6px', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                {invoice.client_email && <>{invoice.client_email}<br /></>}
                {invoice.client_address ? (
                  invoice.client_address.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)
                ) : (
                  <>Islamabad, Pakistan</>
                )}
              </p>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="a4-bill-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px', gap: '20px' }}>
            <div className="a4-bill-col" style={{ flex: 1 }}>
              <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#2563eb', marginBottom: '8px', letterSpacing: '0.5px', fontWeight: 700 }}>Invoice Metadata</h5>
              <div className="a4-meta-grid" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px 12px', fontSize: '12px' }}>
                <label style={{ color: '#64748b' }}>Invoice Number:</label> <span style={{ color: '#0f172a', fontWeight: 600 }}>{invoice.invoice_number}</span>
                <label style={{ color: '#64748b' }}>Issue Date:</label> <span style={{ color: '#0f172a' }}>{invoice.date}</span>
                <label style={{ color: '#64748b' }}>Payment Terms:</label> <span style={{ color: '#0f172a' }}>Due on Receipt</span>
              </div>
            </div>
            <div className="a4-bill-col" style={{ flex: 1 }}>
              <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#2563eb', marginBottom: '8px', letterSpacing: '0.5px', fontWeight: 700 }}>Status</h5>
              <span style={{ 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                fontSize: '15px', 
                color: invoice.status === 'paid' ? '#10b981' : '#f59e0b' 
              }}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <table className="a4-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #0f172a' }}>
                <th style={{ width: '50%', padding: '12px 0', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Description</th>
                <th style={{ width: '10%', padding: '12px 0', textAlign: 'right', color: '#475569', fontWeight: 600 }}>Qty</th>
                <th style={{ width: '20%', padding: '12px 0', textAlign: 'right', color: '#475569', fontWeight: 600 }}>Unit Price</th>
                <th style={{ width: '20%', padding: '12px 0', textAlign: 'right', color: '#475569', fontWeight: 600 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => {
                const itemSub = Number(item.qty || 0) * Number(item.price || 0);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 0', textAlign: 'left', color: '#0f172a' }}>{item.name}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', color: '#0f172a' }}>{item.qty}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', color: '#0f172a' }}>{formatCurrencyValue(Number(item.price || 0), currencyVal)}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                      {formatCurrencyValue(itemSub, currencyVal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Calculations */}
          <div className="a4-total-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '120px 100px', 
            justifyContent: 'end', 
            gap: '8px 16px', 
            fontSize: '13px', 
            textAlign: 'right',
            borderBottom: '2px solid #0f172a',
            paddingBottom: '16px',
            marginBottom: '24px'
          }}>
            <label style={{ color: '#475569' }}>Subtotal:</label> <span style={{ color: '#0f172a', fontWeight: 600 }}>{formatCurrencyValue(itemSubtotal, currencyVal)}</span>
            <label style={{ color: '#475569' }}>Tax Rate ({taxVal}%):</label> <span style={{ color: '#0f172a' }}>{formatCurrencyValue(itemTax, currencyVal)}</span>
            <label className="grand-total-label" style={{ fontWeight: 900, fontSize: '16px', color: '#0f172a' }}>Grand Total:</label> 
            <span className="grand-total-val" style={{ fontWeight: 900, fontSize: '16px', color: '#0f172a' }}>{formatCurrencyValue(itemTotal, currencyVal)}</span>
          </div>

          {/* Stamp Display */}
          {invoice.stamp && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '10px', marginRight: '20px' }}>
              <p style={{ fontSize: '9px', textTransform: 'uppercase', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>Authorized Stamp</p>
              <img src={invoice.stamp} style={{ maxHeight: '75px', maxWidth: '120px', objectFit: 'contain' }} alt="Company Stamp" />
            </div>
          )}

          {/* Footer */}
          <div className="a4-footer" style={{ textAlign: 'center', marginTop: '40px', fontSize: '11px', color: '#64748b' }}>
            <p>Thank you for your business. For invoice questions, please contact billing@parchilo.com</p>
            <p style={{ marginTop: '6px', fontSize: '9px', color: '#94a3b8' }}>
              Generated by Parchilo Invoice System. Secure client-side local cache.
            </p>
          </div>

        </div>
      </div>

      {/* CSS Styles for Print View */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print, .no-print * {
            display: none !important;
          }
          .invoice-view-page {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .invoice-a4-wrap {
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
          .invoice-a4, .invoice-a4 * {
            visibility: visible;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .invoice-a4 {
            padding: 0 !important;
            border: none !important;
          }
          .a4-logo-invert, .a4-meta-title, .grand-total-label, .grand-total-val {
            color: #000000 !important;
          }
          .a4-header {
            border-bottom: 2px solid #000000 !important;
          }
          .a4-table th {
            color: #000000 !important;
            border-bottom: 2px solid #000000 !important;
          }
          .a4-table td {
            border-bottom: 1px solid #e2e8f0 !important;
          }
          .a4-total-grid {
            border-bottom: 2px solid #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
