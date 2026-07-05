# Vercel Deployment Guide for Muhammad Danish Portfolio

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables Setup**
Add these to your Vercel project settings:

```
SECRET_KEY = <your-secret-key>
DEBUG = False
DJANGO_SETTINGS_MODULE = portfolio.settings
```

**For Production Database (Optional):**
```
DATABASE_URL = postgresql://user:password@host:port/dbname
```

---

## 🚀 Deployment Steps

### Step 1: Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Select your GitHub repository: `danishriazali501-ui/Muhammad-Danish-Portfolio`
4. Click "Import"

### Step 2: Configure Project Settings
1. **Framework Preset**: Select "Python" or "Other"
2. **Build Command**: `bash build.sh`
3. **Install Command**: `pip install -r requirements.txt`
4. **Output Directory**: (Leave empty - Flask/Django specific)

### Step 3: Add Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add all variables from `.env.example`
3. **IMPORTANT**: Set a strong `SECRET_KEY` (not the example one)

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Check logs if there are issues

---

## 🔧 Troubleshooting

### Error: "ModuleNotFoundError: No module named 'django'"
**Solution**: Dependencies aren't installed. Check:
- `requirements.txt` exists and is correct
- Python version matches (3.11.9)
- Run: `pip install -r requirements.txt`

### Error: "CSRF verification failed"
**Solution**: Add your Vercel domain to `ALLOWED_HOSTS`:
```python
ALLOWED_HOSTS = ['yourdomain.vercel.app', 'localhost', '127.0.0.1']
```

### Error: "static files not found" (404)
**Solution**: Ensure WhiteNoise is configured correctly:
- Check `STATICFILES_STORAGE` in settings.py
- Run: `python manage.py collectstatic --noinput`

### Error: "Database connection failed"
**Solution**: 
- For development: SQLite (db.sqlite3) is automatically used
- For production: Set `DATABASE_URL` environment variable
- Example PostgreSQL: `postgresql://user:pass@host:5432/dbname`

### Long build times
**Solution**: 
- Clear Vercel cache: Go to Settings → Caches → Clear cache
- Rebuild the project

---

## 📊 Project Structure

```
Muhammad-Danish-Portfolio/
├── portfolio/               # Django project settings
│   ├── settings.py         # Configuration
│   ├── wsgi.py            # WSGI application
│   └── urls.py            # URL routing
├── core/                   # Main Django app
│   ├── models.py          # Database models
│   ├── views.py           # API endpoints
│   ├── serializers.py     # DRF serializers
│   └── migrations/        # Database migrations
├── static/                # CSS, JS, Images
├── templates/             # HTML templates
├── requirements.txt       # Python dependencies
├── vercel.json           # Vercel configuration
├── build.sh              # Build script
└── manage.py             # Django CLI
```

---

## 📝 Key Files Modified

| File | Change | Reason |
|------|--------|--------|
| `vercel.json` | Updated build config | Correct Django deployment |
| `portfolio/settings.py` | Fixed duplicate STATIC_ROOT | Remove duplication error |
| `runtime.txt` | Added Python version | Specify Python 3.11.9 |
| `build.sh` | Enhanced with error handling | Better debugging |
| `requirements.txt` | Added Pillow, python-dotenv | Missing dependencies |
| `core/migrations/0001_initial.py` | Created migration file | Enable database setup |

---

## 🔐 Security Notes

⚠️ **Before going live:**
1. Change `SECRET_KEY` to a random, secure value
2. Set `DEBUG = False` in environment
3. Update `ALLOWED_HOSTS` with your domain
4. Use HTTPS (enable `SECURE_SSL_REDIRECT`)
5. Use a production database (PostgreSQL recommended)

---

## ✨ After Deployment

1. Test all endpoints:
   - GET `/api/skills/`
   - GET `/api/projects/`
   - GET `/api/services/`
   - POST `/api/contact/` (test contact form)

2. Verify static files load correctly

3. Monitor logs in Vercel dashboard

---

## 📞 Support

For issues, check:
- [Django Docs](https://docs.djangoproject.com/)
- [Vercel Python Guide](https://vercel.com/docs/functions/serverless-functions/python)
- [Vercel Troubleshooting](https://vercel.com/docs/troubleshoot)
