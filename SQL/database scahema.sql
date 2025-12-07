CREATE TABLE customers_id (
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

CREATE TABLE orders {
  order_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id),
  order_total DECIMAL(10, 2),
  order_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
};

SELECT TABLE FROM payment_methods WHERE customer_id = 0 AND is_default = TRUE;
FROM payment_methods SELECT * WHERE customer_id = 0 AND is_default = TRUE;

