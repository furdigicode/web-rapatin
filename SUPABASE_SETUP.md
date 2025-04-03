
# Supabase Setup for Rapatin Admin Dashboard

This document explains how to set up Supabase to work with the Rapatin admin dashboard.

## 1. Create a Supabase Project

1. Sign up for Supabase at [https://supabase.com](https://supabase.com) if you haven't already
2. Create a new project from the Supabase dashboard
3. Note down your project URL and anon key (under Project Settings > API)

## 2. Environment Variables

Create a `.env` file in your project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the SQL from `src/db/schema.sql` and run it
3. This will create all necessary tables and initial data

## 4. Set Up Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Email Auth", make sure "Enable Email Signup" is turned on
3. You can customize the email templates and other settings as needed

## 5. Create Admin User(s)

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Invite user"
3. Enter the admin email address (e.g., admin@rapatin.id)
4. Once invited, the user will receive an email to set their password
5. Alternatively, you can create a user directly using the SQL Editor:

```sql
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
VALUES (
  'admin@rapatin.id', 
  crypt('admin123', gen_salt('bf')), 
  now(), 
  'authenticated'
);
```

## 6. Storage Setup (Optional)

If you plan to upload images:

1. Go to Storage in the Supabase dashboard
2. Create buckets for different media types (e.g., "blog-images", "testimonial-avatars")
3. Set up appropriate bucket policies

## 7. Deploy Application

Make sure your production environment also has the Supabase environment variables set correctly.

## Supabase Functions (Optional)

For advanced features like email sending or third-party integrations, you may want to use Supabase Edge Functions.

## Troubleshooting

- Check the browser console for errors
- Verify that your RLS policies are set up correctly
- Confirm environment variables are properly loaded
