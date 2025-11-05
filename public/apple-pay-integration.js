const applePayButtons = document.querySelectorAll('.apple-pay-button');

function initiateApplePay(event) {
  const item = event.target.dataset.item;
  const price = event.target.dataset.price;

  const paymentRequest = {
    countryCode: 'US',
    currencyCode: 'USD',
    merchantCapabilities: ['supports3DS'],
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
    total: {
      label: `Car Collection: ${item}`,
      type: 'final',
      amount: price
    },
    requiredBillingContactFields: ['postalAddress'],
    requiredShippingContactFields: []
  };

  const session = new ApplePaySession(3, paymentRequest);

  session.onvalidatemerchant = event => {
    fetch('/validate-merchant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validationURL: event.validationURL })
    })
      .then(res => res.json())
      .then(merchantSession => {
        session.completeMerchantValidation(merchantSession);
      })
      .catch(err => {
        console.error('Merchant validation failed:', err);
        session.abort();
      });
  };

  session.onpaymentauthorized = event => {
    fetch('/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: event.payment.token })
    })
      .then(res => res.json())
      .then(result => {
        const status = result.success
          ? ApplePaySession.STATUS_SUCCESS
          : ApplePaySession.STATUS_FAILURE;
        session.completePayment(status);
      })
      .catch(err => {
        console.error('Payment processing failed:', err);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
      });
  };

  session.oncancel = () => {
    console.log('Apple Pay payment cancelled');
  };

  session.begin();
}

if (window.ApplePaySession) {
  ApplePaySession.canMakePaymentsWithActiveCard('merchant-identifier')
    .then(canMakePayments => {
      applePayButtons.forEach(button => {
        if (canMakePayments) {
          button.style.display = 'inline-block';
          button.style.setProperty('-webkit-appearance', '-apple-pay-button');
          button.style.setProperty('-apple-pay-button-type', 'buy');
          button.style.setProperty('-apple-pay-button-style', 'black');
          button.addEventListener('click', initiateApplePay);
        } else {
          button.style.display = 'none';
        }
      });

      if (!canMakePayments) {
        console.log('Apple Pay is not available or no active card configured');
      }
    })
    .catch(err => {
      console.error('Error checking Apple Pay availability:', err);
      applePayButtons.forEach(button => {
        button.style.display = 'none';
      });
    });
} else {
  applePayButtons.forEach(button => {
    button.style.display = 'none';
  });
  console.log('Apple Pay is not supported on this device or browser');
}
