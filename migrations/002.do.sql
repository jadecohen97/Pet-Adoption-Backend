CREATE TABLE IF NOT EXISTS pets(
    id      VARCHAR(36) DEFAULT (UUID()),
    type      VARCHAR(50) NOT NULL,
    name          VARCHAR(200) NOT NULL,
    adoption_Status    VARCHAR(50) NOT NULL,
    picture_url         VARCHAR(500) NOT NULL,
    height              INT NOT NULL,
    weight              INT NOT NULL,
    color               VARCHAR(50) NOT NULL,
    bio                 VARCHAR(255) NOT NULL,
    hypoallergenic       BOOLEAN NOT NULL,
    dietary_restrictions VARCHAR(255) NOT NULL,
    breed                VARCHAR(200) NOT NULL,
    PRIMARY KEY (id)
    ); 
    
