function onApplePayButtonClicked() { 

    if (!ApplePaySession) {
        return;
    }
    
    // Define ApplePayPaymentRequest
    const request = {
        "countryCode": "US",
        "currencyCode": "USD",
        "merchantCapabilities": [
            "supports3DS",
            "requiresCardholderName",
            "supportsCredit",
            "supportsDebit"
            
        ],
        "supportedNetworks": [
            "visa",
            "masterCard",
            "amex",
            "discover",
        ],
        
        "total": {
            "label": "null",
            "type": "final",
            "amount": "${total}"
        }
    };
    
    // Create ApplePaySession
    const session = new ApplePaySession(3, request);
    
    session.onvalidatemerchant = async event => {
        // Validate merchant by making a request to the merchant's server. 
        const merchantSession = await validateMerchant();
        session.completeMerchantValidation(merchantSession);
    };
    
    session.onpaymentmethodselected = event => {
        // Define ApplePayPaymentMethodUpdate based on the selected payment method.
        const update = {};
        session.completePaymentMethodSelection(update);
    };
    
    session.onshippingmethodselected = event => {
        // Define ApplePayShippingMethodUpdate based on the selected shipping method.
        
        const update = {};
        session.completeShippingMethodSelection(update);
    };
    
    session.onshippingcontactselected = event => {
        // Define ApplePayShippingContactUpdate based on the selected shipping contact.
        const update = {};
        session.completeShippingContactSelection(update);
    };
    
    session.onpaymentauthorized = event => {
        // Define ApplePayPaymentAuthorizationResult
        const result = {
            "status": ApplePaySession.STATUS_SUCCESS
        };
        session.completePayment(result);
    };
    
    session.oncouponcodechanged = event => {
        // Define ApplePayCouponCodeUpdate
        const newTotal = calculateNewTotal(event.couponCode);
        const newLineItems = calculateNewLineItems(event.couponCode);
        const newShippingMethods = calculateNewShippingMethods(event.couponCode);
        const errors = calculateErrors(event.couponCode);
        
        session.completeCouponCodeChange({
            newTotal: newTotal,
            newLineItems: newLineItems,
            newShippingMethods: newShippingMethods,
            errors: errors,
        });
    };
    
    session.oncancel = event => {
        // Payment canceled by WebKit
    };
    
    session.begin();
}