// applepay-session.js

// Only define a mock if ApplePaySession is not available
if (typeof window.ApplePaySession === "undefined") {
  class MockApplePaySession {
    constructor(version, request) {
      console.log("Mock ApplePaySession created", version, request);
    }
    begin() {
      console.log("Mock session started");

      // Simulate merchant validation
      setTimeout(() => {
        this.onvalidatemerchant &&
          this.onvalidatemerchant({ validationURL: "https://mock-validation" });
      }, 500);

      // Simulate payment authorization
      setTimeout(() => {
        this.onpaymentauthorized &&
          this.onpaymentauthorized({
            payment: { token: "mock-token", billingContact: {}, shippingContact: {} }
          });
      }, 1500);
    }
    completeMerchantValidation(session) {
      console.log("Mock merchant validated:", session);
    }
    completePayment(status) {
      console.log("Mock payment completed with status:", status);
    }
  }

  window.ApplePaySession = MockApplePaySession;
  window.ApplePaySession.canMakePayments = () => true;
  window.ApplePaySession.STATUS_SUCCESS = "success";
  window.ApplePaySession.STATUS_FAILURE = "failure";
}