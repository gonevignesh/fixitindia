ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS rating DECIMAL DEFAULT 4.8;

-- Update existing services with placeholder/Unsplash images
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500' WHERE category = 'Plumbing';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1621905252507-b354bc2d1bb6?w=500' WHERE category = 'Electrical';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1594142465967-58688b18a0ca?w=500' WHERE category = 'Appliance Repair';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500' WHERE category = 'Carpentry';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500' WHERE category = 'Painting';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1581578731522-745a05ad9ad5?w=500' WHERE category = 'Cleaning';
