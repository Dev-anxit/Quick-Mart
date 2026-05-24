declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler?: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: { color?: string };
}

/**
 * Load Razorpay script dynamically
 */
export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);

    // Timeout fallback
    setTimeout(() => resolve(false), 8000);
  });
}

const isDemoKey = (key: string) =>
  !key ||
  key === 'rzp_test_demokey123456' ||
  key.startsWith('rzp_test_dummy') ||
  key === 'undefined' ||
  key === 'null';

/**
 * Open Razorpay checkout modal.
 * Falls back to a simulated payment dialog in dev mode with placeholder keys.
 */
export function openRazorpayCheckout(options: RazorpayOptions): void {
  // If using demo/placeholder key → simulate payment for development
  if (!window.Razorpay || isDemoKey(options.key)) {
    console.warn('[QuickMart] Running in DEV payment mode. Using simulated Razorpay.');
    showDevPaymentModal(options);
    return;
  }

  const razorpay = new window.Razorpay({
    ...options,
    theme: { color: '#0d9e6e' },
  });
  razorpay.open();
}

/**
 * Development payment modal — shows a clean dialog so you can test
 * the full checkout flow without real Razorpay credentials.
 */
function showDevPaymentModal(options: RazorpayOptions) {
  // Remove any existing modal
  document.getElementById('qm-dev-payment-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'qm-dev-payment-modal';
  modal.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif;
  `;

  const amount = (options.amount / 100).toFixed(0);
  modal.innerHTML = `
    <div style="
      background: #fff; border-radius: 20px; padding: 2rem;
      max-width: 420px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
    ">
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔒</div>
      <div style="font-size: 0.75rem; color: #888; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">Powered by</div>
      <div style="font-size: 1.4rem; font-weight: 900; color: #072654; margin-bottom: 1.5rem;">Razorpay <span style="font-size: 0.7rem; background: #ffe600; color: #072654; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 800;">DEV MODE</span></div>
      
      <div style="background: #f5f5f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.8rem; color: #888; margin-bottom: 0.25rem;">Amount to pay</div>
        <div style="font-size: 2rem; font-weight: 900; color: #111;">₹${amount}</div>
        <div style="font-size: 0.78rem; color: #aaa;">Order: ${options.order_id}</div>
      </div>

      <div style="background: #fff8e1; border: 1px solid #ffd54f; border-radius: 10px; padding: 0.75rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: #795548; text-align: left;">
        ⚠️ <strong>Development Mode:</strong> Add real Razorpay keys in <code>frontend/.env</code> to enable live payments. Click "Pay Now" to simulate a successful payment.
      </div>

      <button id="qm-pay-btn" style="
        width: 100%; background: linear-gradient(135deg, #0d9e6e, #059669);
        color: white; border: none; border-radius: 12px; padding: 1rem;
        font-size: 1rem; font-weight: 800; cursor: pointer; margin-bottom: 0.75rem;
        font-family: inherit;
      ">✓ Pay ₹${amount} (Simulate)</button>
      <button id="qm-cancel-btn" style="
        width: 100%; background: none; border: none; color: #888;
        font-size: 0.875rem; cursor: pointer; font-family: inherit; font-weight: 600;
      ">Cancel Payment</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('qm-pay-btn')?.addEventListener('click', () => {
    modal.remove();
    // Simulate Razorpay success response
    options.handler?.({
      razorpay_payment_id: `pay_mock_${Date.now()}`,
      razorpay_order_id: options.order_id,
      razorpay_signature: `sig_mock_${Date.now()}`,
    });
  });

  document.getElementById('qm-cancel-btn')?.addEventListener('click', () => {
    modal.remove();
    options.modal?.ondismiss?.();
  });

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      options.modal?.ondismiss?.();
    }
  });
}
