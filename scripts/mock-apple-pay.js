if (!window.ApplePaySession) {
  class MockApplePaySession {
    constructor(version, request) {
      this.version = version;
      this.request = request;
      this.onvalidatemerchant = null;
      this.onpaymentauthorized = null;
      this.oncancel = null;
    }

    begin() {
      console.log('Mock Apple Pay session started');
      setTimeout(() => {
        if (this.onvalidatemerchant) {
          this.onvalidatemerchant({ validationURL: 'https://mock-validation-url.com' });
        }
        setTimeout(() => {
          if (this.onpaymentauthorized) {
            this.onpaymentauthorized({
              payment: {
                token: { mock: 'token_12345' }
              }
            });
          }
        }, 1000);
      }, 500);
    }

    completeMerchantValidation(session) {
      console.log('Mock merchant validation complete:', session);
    }

    completePayment(status) {
      console.log('Mock payment completed with status:', status);
    }
  }

  window.ApplePaySession = MockApplePaySession;
  ApplePaySession.canMakePayments = () => true;
}