import logo from './logo.svg';
import './index.css';
import React from 'react';
import './App.css';
import PaymentInfo from './components/paymentinfo';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </header>
      <PaymentInfo paymentSuccess={true} trackingNumber={"ABC123XYZ"} />
    </div>
  );
}

export default App;