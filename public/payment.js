async function onApplePayButtonClicked() {
    if (typeof PaymentRequest === "undefined") {
        console.warn("PaymentRequest API is not available. Consider falling back to Apple Pay JS.");
        return;
    }

    try {
        const paymentMethodData = [{
            supportedMethods: "https://apple.com/apple-pay",
            data: {
                version: 3,
                merchantIdentifier: "merchant.com.apdemo",
                merchantCapabilities: ["supports3DS"],
                supportedNetworks: ["amex", "discover", "masterCard", "visa"],
                countryCode: "US"
            }
        }];

        const paymentDetails = {
            total: {
                label: "Demo (Card is not charged)",
                amount: { value: "27.50", currency: "USD" }
            }
        };

        const paymentOptions = {
            requestPayerName: false,
            requestBillingAddress: false,
            requestPayerEmail: false,
            requestPayerPhone: false,
            requestShipping: false,
            shippingType: "shipping"
        };

        const request = new PaymentRequest(paymentMethodData, paymentDetails, paymentOptions);

        request.onmerchantvalidation = async event => {
            try {
                const merchantSession = await validateMerchant();
                event.complete(merchantSession);
            } catch (err) {
                console.error("Merchant validation failed:", err);
                event.complete(null);
            }
        };

        request.onpaymentmethodchange = event => {
            const { methodDetails } = event;

            if (methodDetails?.type) {
                event.updateWith({ total: paymentDetails.total });
            } else if (methodDetails?.couponCode) {
                const couponCode = methodDetails.couponCode;

                event.updateWith({
                    total: calculateTotal(couponCode),
                    displayItems: calculateDisplayItem(couponCode),
                    shippingOptions: calculateShippingOptions(couponCode),
                    modifiers: [{
                        data: {
                            additionalShippingMethods: calculateShippingOptions(couponCode)
                        }
                    }],
                    error: calculateError(couponCode)
                });
            }
        };

        request.onshippingoptionchange = event => {
            event.updateWith({ total: paymentDetails.total });
        };

        request.onshippingaddresschange = event => {
            event.updateWith({}); // You can enhance this with address-based logic
        };

        const response = await request.show();
        await response.complete("success");
    } catch (e) {
        console.error("Apple Pay request failed:", e);
    }
}