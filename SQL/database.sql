CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT
); 

CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    expiry_date DATE NOT NULL,
    cvv VARCHAR(4) NOT NULL
);

CREATE transaction_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE receipts (
    id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL,
    receipt_url TEXT NOT NULL,
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_car_make_model ON cars (make, model);
CREATE INDEX idx_transaction_user ON transaction_logs (user_id);
CREATE INDEX idx_payment_user ON payment_methods (user_id);

--  storing token 
ALTER TABLE payment_methods
ADD COLUMN payment_netwrk VARCHAR(50);
ADD COLUM token_hash TEXT;


-- cx payment store 
CREATE TABLE payment_methods (
  method_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id),
  method_type VARCHAR(50), -- 'Apple Pay', 'Visa', 'MasterCard'
  card_last4 VARCHAR(4),
  card_brand VARCHAR(50), --  'Visa', 'Amex'
  token_reference TEXT, -- Token or reference from payment network
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

