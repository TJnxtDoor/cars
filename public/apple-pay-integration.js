const applePayButtons = document.querySelectorAll('.apple-play-button')

function initiateApplePay(event) {
  const item = event.target.dataset.item;
  const price = event.target.dataset.price;

  const paymentRequest = {
    coutryCode: 'US',
    currencyCode: 'USD',
    merchantCapabilities: ['supports3DS'],
    supportCapabilities: ['visa', 'mastercard', 'amex', 'discover'],
    total: {
      label: 'Car Collection: ' + item,
      type: 'final',
      amaount: price
    },
    requiredBillingContactFields: ['postalAdress'],
    requiredShippingContactFields: []
  };
  const session = new ApplePlaySession(3, paymentRequest);

  session.onvalidatemerchant = function (event) {
    fetch('/validate-merchant', {
      method: 'POST',
      body: JSON.stringify({ validationURL: event.validationURL }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(merchantSession => {
        session.completeMerchantValidation(merchantSession);
      });
  };

  session.onpaymentauthorized = function (event) {
    fetch('/process-payment', {
      method: 'POST',
      body: JSON.stringify({ token: event.payment.token }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          session.completePayment(ApplePaySession.STATUS_SUCCESS);
        } else {
          session.completePayment(ApplePaySession.STATUS_FAILURE);
        }
      });
  };

  session.oncancel = function () {
    console.log('Apple Pay payment cancelled');
  };

  session.begin();
}

if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
  applePayButtons.forEach(button => {
    button.style.display = 'inline-block';
    button.style.setProperty('-webkit-appearance', '-apple-pay-button');
    button.style.setProperty('-apple-pay-button-type', 'buy');
    button.style.setProperty('-apple-pay-button-style', 'black');
    button.addEventListener('click', initiateApplePay);
  });
} else {
  applePayButtons.forEach(button => {
    button.style.display = 'none';
  });
  console.log('Apple Pay is not available or device not configured');
}

