function initializeApplePay() {
    // Apple Pay button implementation
    const applePayButton = document.getElementById('apple-pay-button');
    applePayButton.addEventListener('click', async () => {
        try {
            await initiateApplePayPayment();
        } catch (error) {
            console.error('Error initiating Apple Pay payment:', error);
        }
    });


    async function initiateApplePayPayment() {
        try {
            const paymentMethodData = [{
                supportedMethods: "https://apple.com/apple-pay",
                data: {
                    version: 3,
                    merchantIdentifier: "merchant.com.example.demo",
                    merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
                    supportedNetworks: ["amex", "discover", "masterCard", "visa"],
                    countryCode: "US",
                    currencyCode: "USD"
                }
            }];

            const paymentDetails = {
                total: {
                    label: "Demo Purchase (Card is not charged)",
                    amount: { value: "${null}", currency: "USD" }
                }
            };
        }
        catch (error) {
            console.error('Error setting up payment request:', error);
        }    
    }
}