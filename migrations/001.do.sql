CREATE TABLE IF NOT EXISTS signup(
id            VARCHAR(36) DEFAULT (UUID()),
first_name          VARCHAR(200) NOT NULL,
last_name         VARCHAR(200) NOT NULL,
email           VARCHAR(255) NOT NULL,
phone_number    INT NOT NULL UNIQUE,
password_hash      VARCHAR(255) NOT NULL,
PRIMARY KEY (id)
);