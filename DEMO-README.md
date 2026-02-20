# 🏫 Dynamic Demo System — Usage Guide

This website has been enhanced with a URL-parameter based demo system.
You can instantly personalise it for any school by just changing the URL.

---

## 🚀 Method 1 — URL Parameters (Quick Demo)

Pass any combination of these parameters in the URL:

```
index.html?name=School%20Name&phone=9876543210&address=City,State
```

### All Supported Parameters

| Parameter   | Purpose                                         | Example                          |
|-------------|--------------------------------------------------|----------------------------------|
| `name`      | School/institute name                            | `name=Sunrise%20Academy`         |
| `nameAs`    | Name in Assamese / regional script               | `nameAs=Sunrise%20Academy`       |
| `shortName` | Short code for stamp                             | `shortName=SA`                   |
| `tagline`   | English tagline / motto                          | `tagline=Rising%20Every%20Day`   |
| `type`      | School type                                      | `type=Private%20School`          |
| `district`  | District name                                    | `district=Kamrup`                |
| `state`     | State name                                       | `state=Assam`                    |
| `est`       | Year established                                 | `est=2005`                       |
| `phone`     | Contact phone number                             | `phone=9876543210`               |
| `address`   | Full address                                     | `address=Barpeta%20Road%2C%20Assam` |
| `email`     | Email address                                    | `email=info@school.edu`          |
| `map`       | Google Maps embed URL                            | `map=https://maps.google.com/...`|
| `logo`      | Logo image (path or Drive share URL)             | `logo=demo/sunrise/logo.png`     |
| `hero`      | Hero image(s) — comma-separated                  | `hero=demo/s/h1.jpg,demo/s/h2.jpg` |
| `gallery`   | Gallery images — comma-separated                 | `gallery=demo/s/g1.jpg,g2.jpg`   |

---

## 📁 Method 2 — Demo Profile (Recommended)

1. Create a folder:     `demo/your-school-id/`
2. Create a config:     `demo/your-school-id/config.json`  (see examples below)
3. Put images inside:   `demo/your-school-id/logo.png`, `hero.jpg`, etc.
4. Share this URL:      `index.html?demo=your-school-id`

### Example
```
index.html?demo=sunrise
```
→ Automatically loads `demo/sunrise/config.json` and applies everything.

---

## 🎯 Ready-to-use Example URLs

### Sunrise Academy (via demo profile)
```
index.html?demo=sunrise
```

### Green Valley School (via demo profile)
```
index.html?demo=greenvalley
```

### Quick URL-param demo (no files needed)
```
index.html?name=Bright%20Future%20School&phone=9876543210&address=Guwahati%2C%20Assam&district=Kamrup&tagline=Learning%20Beyond%20Limits&shortName=BFS&est=2008&type=English%20Medium%20School
```

### Full URL with Drive images
```
index.html?name=ABC%20Academy&logo=https://drive.google.com/file/d/YOUR_LOGO_ID/view&hero=https://drive.google.com/file/d/YOUR_HERO_ID/view&phone=9999999999&address=Barpeta%2C%20Assam&district=Barpeta
```

---

## 📋 config.json Template

Copy this for a new demo profile:

```json
{
  "name":          "Your School Name",
  "nameAssamese":  "Your School Name in Assamese",
  "shortName":     "YSN",
  "established":   2000,
  "taglineEn":     "Your Inspiring Motto",
  "type":          "Government / Private School",
  "district":      "District Name",
  "state":         "Assam",
  "affiliation":   "SEBA / CBSE / DEE Assam",

  "contact": {
    "address": "Full Address, District, Assam – PIN",
    "phone":   "+91 XXXXX XXXXX",
    "email":   "school@example.com"
  },

  "mapEmbedUrl": "PASTE YOUR GOOGLE MAPS EMBED URL HERE",

  "logo": {
    "url":          "demo/your-id/logo.png",
    "textFallback": "YSN"
  },

  "heroImages": [
    { "url": "demo/your-id/hero1.jpg", "caption": "Welcome Caption" },
    { "url": "demo/your-id/hero2.jpg", "caption": "Second Caption" }
  ],

  "gallery": [
    { "url": "demo/your-id/g1.jpg", "caption": "Photo Caption" },
    { "url": "demo/your-id/g2.jpg", "caption": "Photo Caption" }
  ],

  "stats": [
    { "label": "Total Students",  "value": 300, "suffix": "+", "icon": "👨‍🎓" },
    { "label": "Pass Percentage", "value": 98,  "suffix": "%", "icon": "📊" },
    { "label": "Teaching Staff",  "value": 15,  "suffix": "+", "icon": "👩‍🏫" },
    { "label": "Years of Service","value": 25,  "suffix": "+", "icon": "🏅" }
  ],

  "headmaster": {
    "name":          "Headmaster Full Name",
    "designation":   "Headmaster / Principal",
    "qualification": "M.A., B.Ed.",
    "experience":    "10+ Years",
    "photoSource":   "Avatar",
    "message": "Dear Students...\n\nYour message here.\n\nWith warm regards,"
  }
}
```

---

## 🖼️ Using Google Drive Images

Instead of hosting images, you can use Google Drive:

1. Upload image to Google Drive
2. Right-click → Share → "Anyone with the link" → Copy link
3. Use the Drive share link directly in URL params or config.json

**In URL params:**
```
?logo=https://drive.google.com/file/d/YOUR_FILE_ID/view
?hero=https://drive.google.com/file/d/FILE1/view,https://drive.google.com/file/d/FILE2/view
```

**In config.json:**
```json
"logo": {
  "driveLink": "https://drive.google.com/file/d/YOUR_FILE_ID/view"
}
```

---

## 🌐 Hosting on GitHub Pages

1. Push all files to a GitHub repository
2. Go to Settings → Pages → Deploy from main branch
3. Your demo URLs will look like:
   ```
   https://yourusername.github.io/repo-name/?demo=sunrise
   ```

## 🌐 Hosting on InfinityFree

1. Upload all files via the File Manager
2. Your demo URLs will look like:
   ```
   https://yoursite.infinityfreeapp.com/index.html?demo=sunrise
   ```

---

## 📂 File Structure

```
your-website/
├── index.html              ← Modified (added IDs)
├── config.js               ← Your school config (unchanged)
├── dynamic-demo.js         ← ✅ NEW — the demo engine
├── components.js           ← Unchanged
├── pages/
│   ├── contact.html        ← Modified (script added)
│   └── ... (all pages)     ← Modified (script added)
├── demo/
│   ├── sunrise/
│   │   ├── config.json     ← ✅ NEW — demo profile
│   │   ├── logo.png        ← (put images here)
│   │   └── hero.jpg        ← (put images here)
│   └── greenvalley/
│       └── config.json     ← ✅ NEW — demo profile
└── assets/
    └── ... (unchanged)
```

---

## ✅ What Gets Personalised

When a demo URL is opened, the following change automatically:

- ✅ School name (header, footer, page titles)
- ✅ School name in Assamese
- ✅ Logo
- ✅ Hero/banner images with captions
- ✅ Gallery images
- ✅ Address (contact page + footer)
- ✅ Phone number
- ✅ Email address
- ✅ Google Maps embed
- ✅ Tagline / motto
- ✅ School type, district, state
- ✅ Year established
- ✅ Stats (students, pass %, staff, years)
- ✅ Headmaster name, photo, message
- ✅ Contact form — auto-injects `institute_name` hidden field
- ✅ Stamp in headmaster section
