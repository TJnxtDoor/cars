async function onApplePayButtonClicked() {
  if (!window.PaymentRequest) {
    console.warn("Payment Request API is not supported in this browser.");
    return;
  }

  try {
    const TOTAL_AMOUNT = "99.99";

    // Define supported payment methods
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

    // Define payment details
    const paymentDetails = {
      total: {
        label: "Demo (Card is not charged)",
        amount: {
          value: TOTAL_AMOUNT,
          currency: "USD"
        }
      }
    };

    // Define payment options
    const paymentOptions = {
      requestPayerName: true,
      requestBillingAddress: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: true,
      shippingType: "shipping"
    };

    // Create the PaymentRequest instance
    const request = new PaymentRequest(paymentMethodData, paymentDetails, paymentOptions);

    // Merchant validation handler
    request.onmerchantvalidation = event => {
      const merchantSessionPromise = validateMerchant(); // Implement this on your server
      event.complete(merchantSessionPromise);
    };

    // Payment method change handler
    request.onpaymentmethodchange = event => {
      if (event.methodDetails?.type) {
        event.updateWith({ total: paymentDetails.total });
      } else if (event.methodDetails?.couponCode) {
        const total = calculateTotal(event.methodDetails.couponCode);
        const displayItems = calculateDisplayItem(event.methodDetails.couponCode);
        const shippingOptions = calculateShippingOptions(event.methodDetails.couponCode);
        const error = calculateError(event.methodDetails.couponCode);

        event.updateWith({
          total,
          displayItems,
          shippingOptions,
          modifiers: [{
            data: { additionalShippingMethods: shippingOptions }
          }],
          error
        });
      }
    };

    // Shipping option change handler (modern syntax)
    request.addEventListener("shippingoptionchange", event => {
      event.updateWith({
        total: {
          label: "Demo (Card is not charged)",
          amount: {
            value: TOTAL_AMOUNT,
            currency: "USD"
          }
        }
      });
    });

    // Show the Apple Pay sheet
    const response = await request.show();
    await response.complete("success");

    // Handle the response (e.g., send to backend)
    console.log("Payment successful:", response);
  } catch (e) {
    console.error("Apple Pay failed:", e);
  }
}