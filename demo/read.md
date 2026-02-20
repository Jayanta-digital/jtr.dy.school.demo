"logo": {
  "driveLink": "https://drive.google.com/file/d/1abc123xyz/view"
},

"heroImages": [
  { "url": "https://drive.google.com/file/d/1def456abc/view", "caption": "Our School" }
],
```

✅ The website automatically converts Drive share links to displayable images.

---

## 🌐 PART 3 — Upload to InfinityFree

### Step 1 — Login to InfinityFree
Go to [infinityfree.com](https://infinityfree.com) → Login → Go to your hosting panel

### Step 2 — Open File Manager
- Click your hosting account
- Click **"File Manager"**
- Navigate to the `htdocs` folder (this is your website root)

### Step 3 — Upload ALL files
Upload the entire `demo-build/` contents into `htdocs/`:
```
htdocs/
├── index.html
├── config.js
├── dynamic-demo.js
├── components.js
├── pages/
├── assets/
└── demo/
    ├── sunrise/config.json
    ├── greenvalley/config.json
    └── kamrup/config.json   ← your new one
```

> **Important:** Upload the CONTENTS of `demo-build/`, not the folder itself. So `index.html` should be directly inside `htdocs/`.

### Step 4 — Adding a new client later
Just upload the new `demo/clientname/` folder via File Manager. No other files need to change. ✅

---

## 🔗 PART 4 — The URL You Send to the Client

Once uploaded, your demo URL will look like:
```
https://yoursite.infinityfreeapp.com/?demo=kamrup
```

Or if you have a custom domain:
```
https://yourdomain.com/?demo=kamrup
```

That's the **one link you send via WhatsApp or email** to the client.

---

## 📲 PART 5 — What to Send the Client (Message Template)

Here's a ready WhatsApp/email message you can send:

---

> 🏫 **Your School Website is Ready for Preview!**
>
> Dear [Principal Name],
>
> Please click the link below to see how your school's website will look:
>
> 👉 **https://yoursite.infinityfreeapp.com/?demo=kamrup**
>
> This is a live personalised demo — your school name, logo, photos, address and contact details are all shown exactly as they will appear on your official website.
>
> Please review and let me know:
> ✅ Any changes needed (name, address, photos, etc.)
> ✅ Your approval to proceed
>
> This offer is valid for **7 days**.
>
> — [Your Name / JTR Technology]

---

## 🔄 PART 6 — Complete Workflow Summary
```
Client contacts you
       ↓
Collect: Name, Address, Phone, Logo, Photos
       ↓
Create: demo/clientname/config.json
       ↓
Add photos to: demo/clientname/
       ↓
Upload folder to InfinityFree File Manager
       ↓
Send URL: yoursite.com/?demo=clientname
       ↓
Client reviews → Approves → You build their full site
