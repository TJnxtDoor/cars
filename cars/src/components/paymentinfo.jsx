import React from 'react';
const paymentinfo = ({ paymentSuccess, trackingNumber }) => {
  if (paymentSuccess) return null;

return (
    <div className='tracking-number'>
      <h3>Purchase Confirmed</h3>
      <p> Tracking receipt  NNumber:</p>
      <code>
        {trackingNumber}
      </code>
      <br />
      <a href='./track/${trackingNumber}'> Track Your Order</a>
    </div>
  );
}
export default paymentinfo;


79