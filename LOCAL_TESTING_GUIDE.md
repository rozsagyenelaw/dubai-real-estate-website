# 🧪 Local Testing Guide - Premier Dubai Realty

## Step-by-Step: Test Before Going Live

### Step 1: Get Your Gmail App Password

Since you use Google Workspace (info@premierdubairealty.com), you need an "App Password":

1. **Go to:** https://myaccount.google.com/apppasswords
   - Sign in with: info@premierdubairealty.com

2. **Enable 2-Step Verification** (if not already):
   - Go to: https://myaccount.google.com/security
   - Turn on "2-Step Verification"
   - Follow the prompts (use your phone)

3. **Create App Password:**
   - Back to: https://myaccount.google.com/apppasswords
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other (Custom name)"
   - Type: "Premier Dubai Realty Website"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: abcd efgh ijkl mnop)

### Step 2: Update .env File

1. **Open the file:** `.env` (in your project root)

2. **Replace this line:**
   ```
   SMTP_PASS=YOUR_APP_PASSWORD_HERE
   ```

3. **With your actual app password:**
   ```
   SMTP_PASS=abcd efgh ijkl mnop
   ```
   (Remove the spaces - make it: abcdefghijklmnop)

4. **Save the file**

Your `.env` file should look like:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@premierdubairealty.com
SMTP_PASS=abcdefghijklmnop
CONTACT_EMAIL=info@premierdubairealty.com
```

### Step 3: Install Dependencies

Open Terminal in your project folder:

```bash
cd /Users/rozsagyene/dubai-real-estate-website
npm install
```

This installs:
- nodemailer (for sending emails)
- netlify-cli (for local dev server)

### Step 4: Start Dev Server

```bash
netlify dev
```

You'll see:
```
◈ Netlify Dev ◈
◈ Starting Netlify Dev with Custom Configuration
◈ Server now ready on http://localhost:8888
```

### Step 5: Test Each Form

**1. Test Contact Form:**
   - Open: http://localhost:8888/contact.html
   - Fill out the form with REAL email address
   - Click "Send Message"
   - Check inbox: info@premierdubairealty.com
   - Check test email inbox for auto-reply

**2. Test Download Form:**
   - Open: http://localhost:8888/property-bayz.html
   - Click "Download Brochure"
   - Fill out form
   - Submit
   - Check inbox for lead notification
   - Check test email for download link

**3. Test Newsletter:**
   - Open: http://localhost:8888/
   - Scroll to newsletter section
   - Enter test email
   - Submit
   - Check both inboxes

### Step 6: Verify Emails

**You Should Receive:**
- ✅ Form submission with all details
- ✅ Professional HTML formatting
- ✅ All customer info included

**Customer Should Receive:**
- ✅ Auto-reply email
- ✅ Branded template
- ✅ Your contact info
- ✅ Call-to-action buttons

## 🐛 Troubleshooting Local Testing

### "Module not found" Error
```bash
npm install
```

### "Cannot find netlify command"
```bash
npm install -g netlify-cli
```

### Port 8888 Already in Use
```bash
netlify dev --port 9999
```
Then use: http://localhost:9999

### Emails Not Sending

**Check .env file:**
```bash
cat .env
```
Make sure:
- No spaces in app password
- Email is info@premierdubairealty.com
- App password is correct (16 characters)

**Test Gmail login:**
- Try logging into Gmail with your regular password
- Make sure 2-Step Verification is ON
- Create new app password if needed

### "Invalid credentials" Error

This means app password is wrong:
1. Delete old app password in Google
2. Create NEW app password
3. Update .env file
4. Restart netlify dev

### Function Error in Console

**Check Netlify function logs:**
```bash
# In another terminal window
tail -f .netlify/functions-serve/*/console.log
```

## 📧 Test Checklist

Before deploying to production, verify:

- [ ] Contact form sends email
- [ ] You receive admin notification
- [ ] Customer receives auto-reply
- [ ] Download form captures lead
- [ ] Download link sent to customer
- [ ] Newsletter signup works
- [ ] Welcome email sent
- [ ] All emails look professional
- [ ] Mobile responsive (test on phone)
- [ ] No console errors

## 🎯 What to Check in Each Email

### Admin Emails (to you):
- [ ] Subject line clear
- [ ] Customer name
- [ ] Customer email (clickable)
- [ ] Customer phone (clickable)
- [ ] Full message
- [ ] Timestamp
- [ ] Professional formatting

### Customer Auto-Replies:
- [ ] Personalized (uses their name)
- [ ] Your contact info correct
- [ ] Links work
- [ ] WhatsApp button works
- [ ] Professional branding
- [ ] Mobile-friendly

## ⚡ Quick Test Commands

```bash
# Install everything
npm install

# Start dev server
netlify dev

# In another terminal - watch logs
tail -f .netlify/functions-serve/*/console.log

# Stop server
Ctrl + C
```

## 🚀 After Testing Successfully

Once everything works locally:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add working Netlify Functions"
   git push origin main
   ```

2. **Add Environment Variables to Netlify:**
   - Go to Netlify Dashboard
   - Site Settings → Environment Variables
   - Add the same 5 variables from .env file

3. **Deploy and test live!**

## 💡 Pro Tips

**Test with different email addresses:**
- Use your personal email as customer
- Check spam folders
- Test on mobile device
- Try different browsers

**Check email formatting:**
- Open on desktop email client
- Open on mobile email app
- Check Gmail, Outlook, Apple Mail

**Monitor function logs:**
- Netlify Dashboard → Functions tab
- Check for errors
- Monitor response times

## 🆘 Need Help?

**Common Issues:**

1. **App Password Not Working:**
   - Make sure 2-Step Verification is ON
   - Generate NEW app password
   - Copy it exactly (no spaces)

2. **Emails Going to Spam:**
   - This is normal for testing
   - Will be better in production
   - Consider SendGrid for production

3. **Function Not Found:**
   - Make sure netlify dev is running
   - Check netlify.toml exists
   - Verify function files in netlify/functions/

---

## Ready to Test?

1. Get app password from Google
2. Update .env file
3. Run `npm install`
4. Run `netlify dev`
5. Test all forms!

**Questions? Let me know which step you're on!**
