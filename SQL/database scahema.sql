CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  encrypted_personal_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_methods (
  method_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id),
  method_type VARCHAR(50),
  card_last4 VARCHAR(4),
  card_brand VARCHAR(50),
  encrypted_token TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
