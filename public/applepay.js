// Select all Apple Pay buttons
let applePayButtons = document.querySelectorAll('.apple-pay-button');
applePayButtons = []; // sets emty arrays if the was previously declared with (let, var or const) 

// Function to initiate the Apple Pay session
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

    // Merchant validation
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

    // Payment authorization
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


const sd = {}
// Check if Apple Pay is available
if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
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

document.querySelector('.apple-pay-button').addEventListener('click', () => {
    const request = {
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS'],
        total: {
            label: 'Austin Martin',
            amount: '600000.00'
        }
    };

    const session = new ApplePaySession(3, request);

    session.onvalidatemerchant = (event) => {
        console.log('Validating merchant with URL:', event.validationURL);
        session.completeMerchantValidation({ merchantSession: 'mock-session-data' });
    };

    session.onpaymentauthorized = (event) => {
        console.log('Payment authorized:', event.payment);
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
    };

    session.begin();
});