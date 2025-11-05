const ApplePaySession = window.ApplePaySession || MockApplePaySession;

function initiateApplePay(event) {
  const item = event.target.dataset.item;
  const price = event.target.dataset.price;

  const paymentRequest = {
    countryCode: 'US',
    currencyCode: 'USD',
    merchantCapabilities: ['supports3DS'],
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
    total: {
      label: 'Car Collection: ' + item,
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
      });
  };

  session.oncancel = () => {
    console.log('Apple Pay payment cancelled');
  };

  session.begin();
}

if (ApplePaySession && ApplePaySession.canMakePayments()) {
  applePayButtons.forEach(button => {
    button.style.display = 'inline-block';
    button.style.setProperty('-webkit-appearance', '-apple-pay-button');
    button.style.setProperty('-apple-pay-button-type', 'buy');
    button.style.setProperty('-apple-pay-button-style', 'black');
    button.addEventListener('click', initiateApplePay);
  });
} else {
  console.log('Apple Pay is not available or device not configured');
  applePayButtons.forEach(button => {
    button.style.display = 'none';
  });
}

// buttons

applePayButtons.forEach(button => {
  button.style.display = 'inline-block';
  button.style.setProperty('-webkit-appearance', '-apple-pay-button');
  button.style.setProperty('-apple-pay-button-type', 'buy');
  button.style.setProperty('-apple-pay-button-style', 'black');
  button.addEventListener('click', initiateApplePay);
  const applePayButtons = document.querySelectorAll('.apple-pay-button');
});