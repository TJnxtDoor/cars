async function onApplePayButtonClicked() {



    await response.complete("success");

// Send purchase to backend
const { payerName, payerEmail } = response; // or extract from response.details if needed
const carModel = "Ferrari 488 GTB"; // Replace with selected model
const amount = TOTAL_AMOUNT;

const res = await fetch("http://localhost:3000/api/purchase", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ payerName, payerEmail, carModel, amount })
});

const result = await res.json();
if (result.success) {
  alert(`Purchase complete! Tracking #: ${result.trackingNumber}`);
}

  if (!window.PaymentRequest) {
    console.warn("PaymentRequest API is not available. Consider falling back to Apple Pay JS.");
    return;
  }

  try {
    const TOTAL_AMOUNT = "99.99"; // Replace with dynamic value if needed

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

    // Show logo if available
    const logo = document.getElementById('svg-logo');
    if (logo) logo.classList.remove('hidden');

    const paymentDetails = {
      total: {
        label: "Demo (Card is not charged)",
        amount: {
          value: TOTAL_AMOUNT,
          currency: "USD"
        }
      }
    };

    const paymentOptions = {
      requestPayerName: true,
      requestBillingAddress: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: true,
      shippingType: "shipping"
    };

    const request = new PaymentRequest(paymentMethodData, paymentDetails, paymentOptions);

    // Merchant validation
    request.addEventListener("merchantvalidation", async event => {
      try {
        const merchantSession = await validateMerchant(); // Implement this on your server
        event.complete(merchantSession);
      } catch (err) {
        console.error("Merchant validation failed:", err);
        event.complete(null);
      }
    });

    // Payment method change
    request.addEventListener("paymentmethodchange", event => {
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
            supportedMethods: "https://apple.com/apple-pay",
            data: {
              additionalShippingMethods: calculateShippingOptions(couponCode)
            }
          }],
          error: calculateError(couponCode)
        });
      }
    });

    // Show Apple Pay sheet
    const response = await request.show();
    await response.complete("success");

    // Optional: handle response (e.g., send to backend)
    console.log("Payment successful:", response);
  } catch (e) {
    console.error("Apple Pay request failed:", e);
  }
}