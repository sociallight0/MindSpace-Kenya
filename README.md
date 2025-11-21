# MindSpace Kenya - Mental Health Platform

A comprehensive mental health platform connecting Kenyans with licensed therapists for private, affordable, and culturally-relevant support.

## 🚀 Features

- **User Authentication**: Secure signup and login with email/phone
- **Smart Therapist Matching**: AI-powered matching based on user needs
- **Dashboard**: Track mood, appointments, and progress
- **Real-time Chat**: Message therapists directly
- **Responsive Design**: Works on all devices
- **Dark Mode**: Eye-friendly interface option

## 📁 Project Structure

```
mindspace-kenya/
├── index.html              # Landing page
├── login.html              # Login page
├── getstarted.html         # Signup & assessment flow
├── dashboard.html          # User dashboard
├── therapy.html            # Therapy booking
├── aiassistant.html        # AI support
├── community.html          # Community forum
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── app.js              # Main application logic
│   └── auth.js             # Authentication handler
└── api/                    # PHP Backend
    ├── config.php          # Database configuration
    ├── signup.php          # Registration endpoint
    ├── login.php           # Authentication endpoint
    ├── logout.php          # Logout endpoint
    └── database.sql        # Database schema
```

## 🛠️ Installation & Setup

### Prerequisites

- **Web Server**: Apache/Nginx
- **PHP**: Version 7.4 or higher
- **MySQL**: Version 5.7 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Step 1: Database Setup

1. **Create the database:**
   ```bash
   mysql -u root -p
   ```

2. **Run the SQL schema:**
   ```sql
   source /path/to/database.sql
   ```
   Or import via phpMyAdmin

3. **Verify tables were created:**
   ```sql
   USE mindspace_kenya;
   SHOW TABLES;
   ```

### Step 2: Configure Backend

1. **Edit `api/config.php`:**
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_username');  // Change this
   define('DB_PASS', 'your_password');  // Change this
   define('DB_NAME', 'mindspace_kenya');
   ```

2. **Set correct file permissions:**
   ```bash
   chmod 644 api/*.php
   ```

### Step 3: Configure Frontend

1. **Edit `js/auth.js`:**
   ```javascript
   const API_BASE_URL = '/api'; // Update to your API path
   const USE_LOCAL_STORAGE = false; // Set to false to use PHP backend
   ```

2. **Update CORS settings if needed** (in `api/config.php`)

### Step 4: Deploy Files

1. **Copy all files to your web server directory:**
   ```bash
   # For Apache on Ubuntu/Debian
   sudo cp -r mindspace-kenya/ /var/www/html/

   # For XAMPP
   cp -r mindspace-kenya/ C:/xampp/htdocs/
   ```

2. **Access the application:**
   - Local: `http://localhost/mindspace-kenya/`
   - Production: `https://yourdomain.com/`

## 🔧 Configuration Options

### Using LocalStorage (No Backend Required)

Perfect for testing and demos:

1. Set in `js/auth.js`:
   ```javascript
   const USE_LOCAL_STORAGE = true;
   ```

2. All data will be stored in browser's localStorage
3. No PHP or MySQL required

### Using PHP Backend (Recommended for Production)

1. Follow all installation steps above
2. Set in `js/auth.js`:
   ```javascript
   const USE_LOCAL_STORAGE = false;
   ```

## 📱 Testing the Application

### Test Accounts

After running the SQL schema, you can login with:

**Admin Account:**
- Email: `admin@mindspace.co.ke`
- Password: `admin123`

### Creating a New Account

1. Go to `getstarted.html`
2. Follow the 7-step onboarding process
3. Complete all fields:
   - Name
   - Concerns (select at least one)
   - Therapy experience
   - Gender
   - Phone (format: 07xxxxxxxx)
   - Email
   - Password (minimum 6 characters)

### Testing Login

1. Go to `login.html`
2. Enter email or phone number
3. Enter password
4. Click "Log In"

## 🎨 Customization

### Branding

Update colors in `css/styles.css`:
```css
:root {
  --jungle: #064e3b;        /* Primary dark green */
  --jungle-light: #059669;  /* Primary light green */
  --accent: #10b981;        /* Accent green */
}
```

### Logo

Replace the text logo with an image in all HTML files:
```html
<div class="logo">
  <img src="path/to/logo.png" alt="MindSpace Kenya">
</div>
```

## 🔐 Security Best Practices

1. **Never commit sensitive data:**
   - Add `config.php` to `.gitignore`
   - Use environment variables for production

2. **Use HTTPS in production:**
   ```apache
   # In .htaccess
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

3. **Implement rate limiting** for login attempts

4. **Regular backups** of database

5. **Keep PHP and MySQL updated**

## 📊 Database Tables

- **users**: User accounts and profiles
- **therapists**: Licensed therapist information
- **appointments**: Therapy sessions
- **messages**: Chat history
- **mood_logs**: Daily mood tracking
- **journal_entries**: Private user journals

## 🐛 Troubleshooting

### Database Connection Fails

```
Error: Database connection failed
```
**Solution:** Check `config.php` credentials and ensure MySQL is running

### Login Not Working

```
Error: Invalid credentials
```
**Solution:** 
- Verify user exists in database
- Check password is correct
- Clear browser cache and try again

### Page Not Loading

```
Error: 404 Not Found
```
**Solution:**
- Check file paths in HTML
- Ensure web server is running
- Verify .htaccess configuration

## 📞 Support

For issues or questions:
- Email: support@mindspace.co.ke
- GitHub Issues: [Link to repo]

## 📄 License

Copyright © 2024 MindSpace Kenya. All rights reserved.

## 🙏 Credits

- **Images**: Pexels (royalty-free)
- **Fonts**: Google Fonts (Poppins, Sora)
- **Icons**: Unicode emoji

---

**Built with ❤️ for mental health awareness in Kenya**
