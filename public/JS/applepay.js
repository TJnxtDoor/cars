 // Select all Apple Pay buttons
        const applePayButtons = document.querySelectorAll('.apple-pay-button');
        
        // Function to initiate the Apple Pay session
        function initiateApplePay(event) {
            // ... (Your existing initiateApplePay function logic)
            const item = event.target.dataset.item;
            const price = event.target.dataset.price;
            
            // NOTE: The Apple Pay API requires a numeric amount string. Ensure data-price is an integer string.
            const paymentRequest = {
                countryCode: 'US',
                currencyCode: 'USD',
                merchantCapabilities: ['supports3DS'],
                supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
                total: {
                    label: 'Car Collection: ' + item,
                    type: 'final',
                    amount: price // Use the string price from data-attribute
                },
                requiredBillingContactFields: ['postalAddress'],
                requiredShippingContactFields: []
            };

            // Version 3 is the recommended version
            const session = new ApplePaySession(3, paymentRequest);

            session.onvalidatemerchant = function(event) {
                const validationURL = event.validationURL;
    
                session.completeMerchantValidation({});
            };

            session.onpaymentauthorized = function(event) {
                // Process payment with your payment processor
                alert(`Payment authorized for ${item}!`);
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
            };

            session.oncancel = function() {
                console.log('Apple Pay payment cancelled');
            };

            session.begin();
        };


        // Checks if Apple Pay is available
        if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
            applePayButtons.forEach(button => {
                // Create native Apple Pay button styling
                button.style.display = 'inline-block';
                // Use WebKit properties for native button rendering
                button.style.setProperty('-webkit-appearance', '-apple-pay-button');
                button.style.setProperty('-apple-pay-button-type', 'buy');
                button.style.setProperty('-apple-pay-button-style', 'black');
                
                button.addEventListener('click', initiateApplePay);
            });
        } else {
            console.log('Apple Pay is not available or device not configured');
            // Hide buttons if Apple Pay is not available
            applePayButtons.forEach(button => {
                button.style.display = 'none';
            });
        }