-- 1
INSERT INTO account
	(account_firstname, account_lastname, account_email,account_password)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3
DELETE FROM account 
WHERE account_id = 1;

--4 
UPDATE inventory
	SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
	WHERE inv_model = 'Hummer';

--5
SELECT inv_make AS make, inv_model AS model, classification_name AS classification
FROM inventory JOIN classification
	ON inventory.classification_id = classification.classification_id
	WHERE classification_name = 'Sport';

--6
UPDATE inventory  
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail,'/images', '/images/vehicles');
