# Mister Wari — React Website

Hyderabad ke restaurant "Mister Wari" ki full React website. Vite + React + React
Router + Tailwind CSS se banayi gayi hai.

## Chalane ka tareeqa (local machine par)

```bash
# 1. Dependencies install karein
npm install

# 2. Development server chalayein
npm run dev

# 3. Production build banayein
npm run build

# 4. Production build ko preview karein
npm run preview
```

Dev server default `http://localhost:5173` par khulega.

## Folder Structure

```
mister-wari-react/
├── index.html                 # HTML entry point, Google Fonts + favicon
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite build config
├── tailwind.config.js          # Tailwind theme (colors, fonts)
├── postcss.config.js           # PostCSS/Tailwind processing
├── public/                     # Static assets served as-is (currently empty)
└── src/
    ├── main.jsx                 # React root + Router provider
    ├── App.jsx                  # Route definitions, wraps app in Cart/Toast providers
    ├── index.css                # Tailwind imports + global/custom CSS
    ├── data/
    │   └── content.js            # ALL text/data: menu (with images, ratings,
    │                              # spice level, badges), branches, gallery,
    │                              # testimonials, FAQs, WhatsApp number, etc.
    ├── context/
    │   ├── CartContext.jsx        # Cart state (add/remove/qty), persisted to
    │   │                          # localStorage, drives the cart badge + drawer
    │   └── ToastContext.jsx       # Small "added to cart" popup notifications
    ├── hooks/
    │   └── useReveal.js          # Scroll-reveal IntersectionObserver hook
    ├── components/
    │   ├── Layout.jsx             # Navbar + page content + Footer + CartDrawer
    │   ├── Navbar.jsx              # Sticky header, mobile menu, cart icon + badge
    │   ├── Footer.jsx
    │   ├── Hero.jsx                # Homepage hero section
    │   ├── SectionHeading.jsx      # Reusable eyebrow + title + description
    │   ├── MenuTabs.jsx            # Search + category filter + MenuItemCard grid
    │   ├── MenuItemCard.jsx        # Product card: image, badges, spice, rating,
    │   │                            # Add to Cart / quantity stepper
    │   ├── RatingStars.jsx         # ★ rating + review count
    │   ├── CartDrawer.jsx          # Slide-in cart panel, qty controls, WhatsApp checkout
    │   ├── BranchCard.jsx          # Single branch card
    │   ├── AboutSection.jsx        # "Hamari Kahani" section
    │   ├── GalleryGrid.jsx         # Responsive photo grid
    │   ├── Testimonials.jsx        # Customer review cards
    │   ├── FaqAccordion.jsx        # Expand/collapse FAQ list
    │   ├── ContactForm.jsx         # Validated form → sends to WhatsApp
    │   └── Reveal.jsx              # Wraps children with scroll-reveal animation
    └── pages/
        ├── Home.jsx                # Hero + bestsellers + branches + about +
        │                            # gallery teaser + testimonials + FAQ + CTA
        ├── Menu.jsx                 # Full menu: search, categories, cart
        ├── Gallery.jsx               # Full gallery page
        ├── Contact.jsx               # Contact form + branch list + map
        └── NotFound.jsx              # 404 page
```

## Website ko internet par LIVE karna (free)

Filhaal yeh website sirf aapke laptop (`localhost`) par chal rahi hai. Poori duniya ko
dikhane ke liye **Vercel** (free hosting) istemal karein:

1. [vercel.com](https://vercel.com) par jaakar free account banayein (GitHub se sign up
   sabse aasan hai)
2. "Add New Project" → apna `mister-wari-react` folder GitHub par push karein (ya
   Vercel CLI se seedha deploy karein: terminal mein `npx vercel` chalayein aur
   instructions follow karein)
3. Vercel automatically pehchan lega ke yeh Vite project hai — bas "Deploy" dabayein
4. 2 minute mein aapko ek free link mil jayegi jaise `mister-wari-react.vercel.app`
5. Apna **custom domain** (jaise `misterwari.com`) chahiye ho to koi bhi domain
   registrar (Namecheap, GoDaddy) se khareed kar Vercel project settings mein add
   kar sakte hain

Netlify ([netlify.com](https://netlify.com)) bhi isi tarah free aur aasan hai, agar
Vercel na chalein.

## Naye features (latest update)

- **Hero video background** — biryani-cooking stock video loop hoti hai hero section mein
- **Live page** (`/live`) — YouTube Live embed dikhata hai jab aap apni kitchen ka
  live stream shuru karein. `src/data/content.js` mein `liveStreamConfig.isLive`
  ko `true` karein aur apna YouTube video ID daalein — offline hone par ek
  "Filhaal Offline" screen dikhti hai
- **Animated stats** — hero ke stats (4+, 30+, 4.8★) scroll mein aane par count-up
  animation ke sath chalte hain
- **Promo ticker** — navbar ke neeche scrolling banner (offers/highlights)
- **Sticky mobile cart bar** — mobile par jab cart mein items hon, screen ke neeche
  ek floating "View Cart" bar dikhti hai
- **Legal pages** — Privacy Policy, Refund Policy, Terms & Conditions (`/privacy-policy`,
  `/refund-policy`, `/terms`) — footer mein link hain
- **SEO basics** — `index.html` mein Restaurant structured data (Google rich results
  ke liye), Open Graph tags (WhatsApp/Facebook share preview), `robots.txt` aur
  `sitemap.xml` (`public/` folder mein), aur har page ka apna browser tab title

## Cart kaise kaam karta hai

- Menu ke kisi bhi item par **"Add to Cart"** dabayein — item cart mein chala jata hai aur
  navbar ka 🛒 icon badge se count dikhata hai.
- Icon dabane se ek **slide-in cart drawer** khulti hai jahan har item ki quantity +/− se
  adjust ki ja sakti hai, ya item hata sakte hain.
- Cart automatically **browser mein save** hoti hai (localStorage) — page reload ya
  dobara website kholne par bhi cart wahi rehti hai.
- **"Checkout on WhatsApp"** dabane se poora order (items, quantity, total) WhatsApp
  chat mein pre-filled message ke taur par khul jata hai — restaurant ko seedha message
  chala jata hai. Real payment/order-backend chahiye ho to yahi function
  (`CartDrawer.jsx` ke `handleCheckout`) ko apne API se replace karein.

## Real content daalne ke liye kya update karein

Sab kuch ek hi jaga se control hota hai — `src/data/content.js`:

- `whatsappNumber` / `phoneDisplay` / `phoneHref` — apna asal WhatsApp aur phone number daalein
- `menuCategories` — 5 categories (Biryani & Pulao, Chatpata Street Food, Fast Food,
  Drinks & Shakes, Desserts) mein items hain. Har item mein `name`, `tag`, `price`,
  `image`, `rating`, `reviewCount`, `spice` (0-3) aur optional `isPopular` / `isNew`
  badges hain — sab apne hisaab se update kar sakte hain. Naya item add karna ho to
  bas array mein ek naya object daal dein, UI automatically update ho jayegi.
- `branches` — asal addresses aur timings
- `galleryImages` — Unsplash placeholder URLs ko apni asal shop/food photos se replace karein
  (photos ko `public/` folder mein daal kar `/photo-name.jpg` se reference kar sakte hain)
- `testimonials` — asal customer reviews
- `faqs` — apne restaurant ke mutabiq sawal-jawab
- `liveStreamConfig` — jab aap YouTube/Facebook Live shuru karein, `isLive: true`
  aur apna `youtubeVideoId` daal dein

**Domain deploy karne ke baad** yeh jagah bhi update kar dein: `index.html` mein
`misterwari.com` wale saare URLs (canonical link, structured data, `og:image`) aur
`public/sitemap.xml` — apne asal domain se replace karein.

## Notes

- **Images**: filhaal free Unsplash stock photos use ho rahi hain. Apni asal
  branch/food photos `public/images/` mein daal kar `content.js` mein path update kar dein.
- **Contact form**: abhi koi backend nahi hai — form submit hone par WhatsApp
  chat khulti hai pre-filled message ke saath. Real order-management system
  chahiye ho to `ContactForm.jsx` ke `handleSubmit` function mein apna API call add karein.
- **Map**: Google Maps embed generic Hyderabad location dikhata hai — `Contact.jsx`
  mein iframe `src` ko apni asal branch location ke Google Maps embed link se replace karein.
