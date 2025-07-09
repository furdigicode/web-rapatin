-- Update admin user password with proper bcrypt hash for "Andalus123!"
-- Hash generated using bcrypt with cost factor 10
UPDATE public.admin_users 
SET password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'rapatinapp@gmail.com';