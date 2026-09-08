// Central content file — sab text/data yahan se aata hai.
// Real branch details, phone number aur images yahan update karein.

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Live", to: "/live" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export const whatsappNumber = "923701235559"; // country code ke saath, bina + ke
export const phoneDisplay = "0300-0000000";
export const phoneHref = "+923000000000";

export const heroStats = [
  { value: "4+", label: "Branches in Hyderabad" },
  { value: "30+", label: "Menu Items" },
  { value: "4.8★", label: "Average Rating" },
];

// Live kitchen stream config.
// isLive: true/false toggle karein jab aap actual YouTube/Facebook Live shuru/band karein.
// youtubeVideoId: apne YouTube Live ka video ID daalein (channel ke "Live" video ka URL se milta hai,
// e.g. youtube.com/watch?v=XXXXXXXXXXX mein 'v=' ke baad wala hissa).
export const liveStreamConfig = {
  isLive: false,
  youtubeVideoId: "",
  title: "Mister Wari Kitchen — Live",
  description:
    "Hamari kitchen ka live nazara — dekhein biryani deg se seedha aap tak kaise pohanchti hai.",
  scheduleNote: "Live stream roz shaam 6 baje se 9 baje tak (jab active ho).",
};

// Har item: id, name, tag, price, image, rating, reviewCount, spice (0-3),
// aur optional badges: isPopular / isNew
export const menuCategories = [
  {
    id: "rice",
    label: "Biryani & Pulao",
    image:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=75",
    items: [
      {
        id: "chicken-biryani",
        name: "Chicken Biryani",
        tag: "Deghi style, dum pukht",
        price: 350,
        image: "https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=600&q=75",
        rating: 4.8,
        reviewCount: 214,
        spice: 2,
        isPopular: true,
      },
      {
        id: "chicken-pulao",
        name: "Chicken Pulao",
        tag: "Halka masala, khushbudar chawal",
        price: 300,
        image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=75",
        rating: 4.5,
        reviewCount: 98,
        spice: 1,
      },
      {
        id: "mutton-biryani",
        name: "Mutton Biryani",
        tag: "Full flavour, tender mutton",
        price: 550,
        image: "https://images.unsplash.com/photo-1691171047462-66025ecd5efc?auto=format&fit=crop&w=600&q=75",
        rating: 4.9,
        reviewCount: 167,
        spice: 2,
        isPopular: true,
      },
      {
        id: "mutton-pulao",
        name: "Mutton Pulao",
        tag: "Desi ghee ka zaiqa",
        price: 500,
        image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 76,
        spice: 1,
      },
      {
        id: "beef-biryani",
        name: "Beef Biryani",
        tag: "Tikha aur masaledar",
        price: 400,
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=75",
        rating: 4.7,
        reviewCount: 142,
        spice: 3,
      },
      {
        id: "beef-pulao",
        name: "Beef Pulao",
        tag: "Sada, ghar jaisa zaiqa",
        price: 350,
        image: "https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?auto=format&fit=crop&w=600&q=75",
        rating: 4.4,
        reviewCount: 61,
        spice: 1,
      },
      {
        id: "daleem",
        name: "Daleem",
        tag: "Ghante bhar pakaya hua, malidar",
        price: 300,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 54,
        spice: 1,
      },
    ],
  },
  {
    id: "chaat",
    label: "Chatpata Street Food",
    image:
      "https://images.unsplash.com/photo-1515931215890-366d3990cf8d?auto=format&fit=crop&w=800&q=75",
    items: [
      {
        id: "gol-gappay",
        name: "Gol Gappay",
        tag: "Teekha pani, aloo filling",
        price: 150,
        image: "https://images.unsplash.com/photo-1653850280260-aa3b9e00b230?auto=format&fit=crop&w=600&q=75",
        rating: 4.7,
        reviewCount: 189,
        spice: 2,
        isPopular: true,
      },
      {
        id: "chana-chaat",
        name: "Chana Chaat",
        tag: "Chatpata aur tangy",
        price: 200,
        image: "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=600&q=75",
        rating: 4.4,
        reviewCount: 67,
        spice: 2,
      },
      {
        id: "fruit-chaat",
        name: "Fruit Chaat",
        tag: "Taaza seasonal fruits",
        price: 250,
        image: "https://images.unsplash.com/photo-1734770931927-6410f9a64832?auto=format&fit=crop&w=600&q=75",
        rating: 4.5,
        reviewCount: 58,
        spice: 0,
      },
      {
        id: "dahi-bhallay",
        name: "Dahi Bhallay",
        tag: "Malai dahi, meethi chutney",
        price: 200,
        image: "https://images.unsplash.com/photo-1515931215890-366d3990cf8d?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 73,
        spice: 1,
      },
    ],
  },
  {
    id: "fast",
    label: "Fast Food",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&w=800&q=75",
    items: [
      {
        id: "zinger-burger",
        name: "Zinger Burger",
        tag: "Crispy patty, special sauce",
        price: 300,
        image: "https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 132,
        spice: 2,
        isPopular: true,
      },
      {
        id: "beef-burger",
        name: "Beef Burger",
        tag: "Juicy patty, cheese aur salad",
        price: 320,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=75",
        rating: 4.5,
        reviewCount: 84,
        spice: 1,
      },
      {
        id: "french-fries",
        name: "French Fries",
        tag: "Crispy, namkeen, garam garam",
        price: 180,
        image: "https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&w=600&q=75",
        rating: 4.3,
        reviewCount: 96,
        spice: 0,
      },
      {
        id: "chicken-wings",
        name: "Chicken Wings (6 pcs)",
        tag: "Spicy fried wings",
        price: 380,
        image: "https://images.unsplash.com/photo-1515931215890-366d3990cf8d?auto=format&fit=crop&w=600&q=75",
        rating: 4.5,
        reviewCount: 47,
        spice: 2,
      },
    ],
  },
  {
    id: "drinks",
    label: "Drinks & Shakes",
    image:
      "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=800&q=75",
    items: [
      {
        id: "coca-cola",
        name: "Coca-Cola",
        tag: "Regular bottle, chilled",
        price: 120,
        image: "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?auto=format&fit=crop&w=600&q=75",
        rating: 4.7,
        reviewCount: 88,
        spice: 0,
      },
      {
        id: "pepsi",
        name: "Pepsi",
        tag: "Regular bottle, chilled",
        price: 120,
        image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 71,
        spice: 0,
      },
      {
        id: "sprite",
        name: "Sprite",
        tag: "Lemon-lime, chilled",
        price: 120,
        image: "https://images.unsplash.com/photo-1618799805265-4f27cb61ede9?auto=format&fit=crop&w=600&q=75",
        rating: 4.5,
        reviewCount: 39,
        spice: 0,
      },
      {
        id: "fanta",
        name: "Fanta",
        tag: "Orange flavour, chilled",
        price: 120,
        image: "https://images.unsplash.com/photo-1625740822008-e45abf4e01d5?auto=format&fit=crop&w=600&q=75",
        rating: 4.4,
        reviewCount: 33,
        spice: 0,
      },
      {
        id: "mineral-water",
        name: "Mineral Water",
        tag: "1.5 litre bottle",
        price: 80,
        image: "https://images.unsplash.com/photo-1524802020103-aa46eaffcaa2?auto=format&fit=crop&w=600&q=75",
        rating: 4.8,
        reviewCount: 52,
        spice: 0,
      },
      {
        id: "mango-lassi",
        name: "Mango Lassi",
        tag: "Malai aur taaza mango",
        price: 250,
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=600&q=75",
        rating: 4.8,
        reviewCount: 104,
        spice: 0,
        isPopular: true,
      },
      {
        id: "plain-lassi",
        name: "Plain Lassi",
        tag: "Thandi, malaidar",
        price: 200,
        image: "https://images.unsplash.com/photo-1719239948819-0afeced16184?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 61,
        spice: 0,
      },
      {
        id: "doodh-soda",
        name: "Doodh Soda",
        tag: "Classic Karachi-style refresher",
        price: 180,
        image: "https://images.unsplash.com/photo-1735643434124-f51889fa1f8c?auto=format&fit=crop&w=600&q=75",
        rating: 4.4,
        reviewCount: 28,
        spice: 0,
      },
      {
        id: "fresh-lime",
        name: "Fresh Lime Soda",
        tag: "Meetha ya namkeen, aap ki pasand",
        price: 180,
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=75",
        rating: 4.5,
        reviewCount: 45,
        spice: 0,
      },
      {
        id: "orange-juice",
        name: "Fresh Orange Juice",
        tag: "100% taaza nichora hua",
        price: 220,
        image: "https://images.unsplash.com/photo-1697642452436-9c40773cbcbb?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 37,
        spice: 0,
      },
      {
        id: "cold-coffee",
        name: "Cold Coffee",
        tag: "Creamy, chilled, thora meetha",
        price: 280,
        image: "https://images.unsplash.com/photo-1636920272028-c27f1ae474c3?auto=format&fit=crop&w=600&q=75",
        rating: 4.7,
        reviewCount: 66,
        spice: 0,
        isNew: true,
      },
      {
        id: "kashmiri-chai",
        name: "Kashmiri Chai",
        tag: "Gulabi rang, dry fruits ke saath",
        price: 200,
        image: "https://images.unsplash.com/photo-1619581073186-5b4ae1b0caad?auto=format&fit=crop&w=600&q=75",
        rating: 4.7,
        reviewCount: 41,
        spice: 0,
        isNew: true,
      },
      {
        id: "doodh-patti-chai",
        name: "Doodh Patti Chai",
        tag: "Garam, kadak, dodh wali",
        price: 100,
        image: "https://images.unsplash.com/photo-1611312410928-bdcb480e6239?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 59,
        spice: 0,
      },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    image:
      "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=800&q=75",
    items: [
      {
        id: "gulab-jamun",
        name: "Gulab Jamun (4 pcs)",
        tag: "Garam, chashni mein doobe hue",
        price: 180,
        image: "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=600&q=75",
        rating: 4.8,
        reviewCount: 72,
        spice: 0,
        isPopular: true,
      },
      {
        id: "kheer",
        name: "Kheer",
        tag: "Chawal ki thandi meethi kheer",
        price: 150,
        image: "https://images.unsplash.com/photo-1758910536889-43ce7b3199fd?auto=format&fit=crop&w=600&q=75",
        rating: 4.5,
        reviewCount: 34,
        spice: 0,
      },
      {
        id: "shahi-tukray",
        name: "Shahi Tukray",
        tag: "Rich, malai aur dry fruits ke saath",
        price: 220,
        image: "https://images.unsplash.com/photo-1646578515903-67873a5398f9?auto=format&fit=crop&w=600&q=75",
        rating: 4.6,
        reviewCount: 29,
        spice: 0,
      },
    ],
  },
];

export const specialDeals = [
  {
    id: "deal-sultan-feast",
    name: "Sultan Biryani Feast",
    tag: "Serves 3-4 Persons",
    description: "2 Double Chicken Biryani + 2 Shami Kabab + 2 Chilled Drinks (500ml) + Raita & Fresh Salad",
    originalPrice: 1250,
    price: 999,
    discount: "20% OFF",
    badge: "Super Hit Deal",
    image: "https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=800&q=75",
    spice: 2,
    rating: 4.9,
    reviews: 340,
  },
  {
    id: "deal-chatkhara-combo",
    name: "Midnight Chatkhara Combo",
    tag: "Street Food Special",
    description: "1 Plate Gol Gappay (8 pcs) + 1 Special Dahi Bhallay + 2 Chilled Mango Lassi",
    originalPrice: 780,
    price: 599,
    discount: "23% OFF",
    badge: "Evening Special",
    image: "https://images.unsplash.com/photo-1653850280260-aa3b9e00b230?auto=format&fit=crop&w=800&q=75",
    spice: 2,
    rating: 4.8,
    reviews: 195,
  },
  {
    id: "deal-royal-dawat",
    name: "Royal Mutton Dawat",
    tag: "Desi Ghee Special",
    description: "2 Mutton Biryani + 1 Mutton Pulao + 4 Gulab Jamun + 1.5L Drink",
    originalPrice: 1950,
    price: 1599,
    discount: "Save Rs. 350",
    badge: "Royal Choice",
    image: "https://images.unsplash.com/photo-1691171047462-66025ecd5efc?auto=format&fit=crop&w=800&q=75",
    spice: 2,
    rating: 4.9,
    reviews: 210,
  },
];

// Har category ke items ek hi jaga se dhoondne ke liye flatten list (search/cart lookups)
export const allMenuItems = menuCategories.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, categoryId: cat.id, categoryLabel: cat.label }))
);

export const branches = [
  {
    name: "Latifabad Branch",
    address: "Unit No. 7, Latifabad, Hyderabad",
    timing: "Daily: 12:00 PM – 1:00 AM",
    tag: "Dine-in + Reda",
  },
  {
    name: "Qasimabad Branch",
    address: "Main Autobahn Road, Qasimabad, Hyderabad",
    timing: "Daily: 12:00 PM – 1:00 AM",
    tag: "Dine-in",
  },
  {
    name: "City Branch",
    address: "Near Resham Gali, Hyderabad City",
    timing: "Daily: 1:00 PM – 12:00 AM",
    tag: "Reda Only",
  },
  {
    name: "Hussainabad Branch",
    address: "Hussainabad Road, Hyderabad",
    timing: "Daily: 12:00 PM – 1:00 AM",
    tag: "Dine-in + Reda",
  },
];

export const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1691171047462-66025ecd5efc?auto=format&fit=crop&w=1000&q=75",
    caption: "Biryani Deg",
    span: "big",
  },
  {
    src: "https://images.unsplash.com/photo-1753123643389-6b52b0a03c6b?auto=format&fit=crop&w=600&q=75",
    caption: "Reda Setup",
  },
  {
    src: "https://images.unsplash.com/photo-1515931215890-366d3990cf8d?auto=format&fit=crop&w=600&q=75",
    caption: "Chatpata Corner",
  },
  {
    src: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=75",
    caption: "Dine-in Area",
  },
  {
    src: "https://images.unsplash.com/photo-1569057173081-bf8c8cd7bd30?auto=format&fit=crop&w=1000&q=75",
    caption: "Kitchen Live",
    span: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=600&q=75",
    caption: "Drinks & Shakes",
  },
];

export const testimonials = [
  {
    name: "Ahmed Raza",
    role: "Latifabad",
    quote:
      "Mister Wari ki chicken biryani Hyderabad mein sab se best hai. Har bite mein wahi purana zaiqa milta hai.",
    rating: 5,
  },
  {
    name: "Sana Baloch",
    role: "Qasimabad",
    quote:
      "Reda se order kiya tha, waqt par garam garam pohcha. Packing bhi acchi thi aur taste bilkul restaurant jaisa.",
    rating: 5,
  },
  {
    name: "Bilal Memon",
    role: "City Branch",
    quote:
      "Dahi bhallay aur gol gappay dono try kiye — chatpata aur fresh. Family ke saath weekend ka favourite spot ban gaya hai.",
    rating: 4,
  },
  {
    name: "Fatima Shaikh",
    role: "Hussainabad",
    quote:
      "Mango lassi aur cold coffee dono bohat acche hain. Ab website se cart mein daal kar order karna aur bhi asaan ho gaya hai.",
    rating: 5,
  },
];

export const faqs = [
  {
    q: "Kya aap home delivery karte hain?",
    a: "Ji haan, hamari saari branches WhatsApp aur phone order accept karti hain. Reda (delivery) ki availability branch ke hisaab se mukhtalif hai — details 'Branches' section mein dekhein.",
  },
  {
    q: "Order minimum kitna hona chahiye?",
    a: "Filhaal koi minimum order requirement nahi hai. Aap ek item bhi order kar sakte hain.",
  },
  {
    q: "Cart se order kaise hota hai?",
    a: "Menu se jo bhi item pasand aaye, 'Add to Cart' dabayein. Cart icon (navbar mein) khol kar quantity adjust karein aur 'Checkout on WhatsApp' dabayein — poora order WhatsApp par chala jayega.",
  },
  {
    q: "Kya advance order le sakte hain, jaise party ya event ke liye?",
    a: "Bilkul — bade orders (walima, party, office lunch) ke liye kam az kam ek din pehle WhatsApp par contact karein.",
  },
  {
    q: "Payment kaise hoti hai?",
    a: "Dine-in aur delivery dono par cash on delivery available hai. Online payment options branch manager se confirm kar lein.",
  },
];
