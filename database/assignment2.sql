--Create new account
INSERT INTO account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

--Change account_type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Delete Tony Stark
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--Inner join to get info on "Sport" vehicles
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

--Add "/vehicles" to image file paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
