import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  User,
  Bot,
  Clock,
  PhoneCall,
  UtensilsCrossed,
  CheckCircle2,
  HelpCircle,
  Flame,
} from "lucide-react";
import { socket } from "../lib/socket";
import { whatsappNumber } from "../data/content";

function getGuestId() {
  let id = localStorage.getItem("chatGuestId");
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("chatGuestId", id);
  }
  return id;
}

const quickPrompts = [
  "Biryani ki price kya hai?",
  "Free delivery kab milti hai?",
  "Hyderabad branches kahan hain?",
  "Table booking kaise karein?",
  "Menu aur deals batao",
];

const WEBSITE_ONLY_GUIDANCE =
  "Main sirf Mister Wari website ke hawale se help kar sakta hoon: menu items, prices, branches, table booking, order tracking, contact details, aur WhatsApp order process. Website ke baare mein hi jawab doon.";

// Smart conversational NLP response generator
function generateSmartReply(userText, currentUserName) {
  const text = userText.toLowerCase().trim();

  // Name Detection
  const namePatterns = [
    /mera naam\s+([a-zA-Z\s]+)/i,
    /mera name\s+([a-zA-Z\s]+)/i,
    /my name is\s+([a-zA-Z\s]+)/i,
    /i am\s+([a-zA-Z\s]+)/i,
    /im\s+([a-zA-Z\s]+)/i,
    /main\s+([a-zA-Z\s]+)\s+hoon/i,
  ];

  for (const pattern of namePatterns) {
    const match = userText.match(pattern);
    if (match && match[1]) {
      const extractedName = match[1].trim().split(" ")[0];
      const capitalized =
        extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      return {
        reply: `Khush Aamdeed ${capitalized} bhai! Mister Wari par aapka dil se swagat hai. Aaj aap kya khana pasand karenge — hamari mashoor Dum Pukht Biryani, Desi Ghee Pulao ya Handi?`,
        detectedName: capitalized,
      };
    }
  }

  // Greetings
  if (
    text.includes("salam") ||
    text.includes("aoa") ||
    text.includes("assalam") ||
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("kese ho") ||
    text.includes("kya hal")
  ) {
    const greetingName = currentUserName ? `${currentUserName} bhai` : "Janab";
    return {
      reply: `Wa Alaikum Assalam ${greetingName}! Mister Wari Restaurant Hyderabad mein khush aamdeed. Main aapki kya madad kar sakta hoon? Hamara taaza menu ya deals dekhna chahte hain?`,
    };
  }

  // Rice / Biryani / Pulao
  if (
    text.includes("biryani") ||
    text.includes("pulao") ||
    text.includes("rice") ||
    text.includes("chawal")
  ) {
    return {
      reply: `Hamari Mashoor Dishes ke rates:\n• Chicken Biryani (Deghi Dum Pukht): Rs. 350\n• Special Mutton Biryani: Rs. 550\n• Beef Tikha Biryani: Rs. 400\n• Desi Ghee Chicken Pulao: Rs. 300\n\nAap website ke 'Menu' section se direct cart mein add kar sakte hain!`,
    };
  }

  // Handi / Karahi / Gravy
  if (
    text.includes("handi") ||
    text.includes("karahi") ||
    text.includes("makhni") ||
    text.includes("gravy") ||
    text.includes("salan")
  ) {
    return {
      reply: `Hamari Desi Handi & Karahi:\n• Chicken Makhni Handi: Rs. 750 (Half) / Rs. 1,400 (Full)\n• Shinwari Mutton Karahi: Rs. 950 (Half) / Rs. 1,800 (Full)\n• Paneer Reshmi Handi: Rs. 650\n\nTaaza khameeri roti aur raita ke sath serve ki jati hai!`,
    };
  }

  // Delivery / Charges / Timings
  if (
    text.includes("delivery") ||
    text.includes("free") ||
    text.includes("time") ||
    text.includes("kitni der") ||
    text.includes("charges")
  ) {
    return {
      reply: `Delivery Policy:\n• Hyderabad mein Rs. 1,500 se upar ke tamam orders par FREE delivery hai.\n• Delivery time taqreeban 30 se 45 minutes hota hai.\n• Order garam aur fresh sealed packing mein pohanchta hai.`,
    };
  }

  // Branches / Location
  if (
    text.includes("branch") ||
    text.includes("kahan") ||
    text.includes("address") ||
    text.includes("location") ||
    text.includes("latifabad") ||
    text.includes("qasimabad") ||
    text.includes("hussainabad") ||
    text.includes("city")
  ) {
    return {
      reply: `Hyderabad mein hamari 4 Branches hain:\n1. Latifabad Unit 7 (Main Auto Bhan Road)\n2. Qasimabad (Main Road Near Citizen Colony)\n3. City Branch (Station Road)\n4. Hussainabad Food Street\n\nAap website ke 'Contact' page par Google Maps live direction bhi dekh sakte hain!`,
    };
  }

  // Table Booking / Reservations
  if (
    text.includes("table") ||
    text.includes("book") ||
    text.includes("reserve") ||
    text.includes("family") ||
    text.includes("hall") ||
    text.includes("seat")
  ) {
    return {
      reply: `Family Hall aur Dine-in Table booking ke liye aap hamari website ke 'Book Table' section mein ja kar 1 minute mein advance booking karwa sakte hain. Hamari team foran confirm karegi!`,
    };
  }

  // Deals / Combos
  if (
    text.includes("deal") ||
    text.includes("combo") ||
    text.includes("discount") ||
    text.includes("offer") ||
    text.includes("bachat")
  ) {
    return {
      reply: `Hamari Super Hit Deals:\n• Dawat-e-Wari Combo (2 Biryani + 1 Cold Drink + Raita): Rs. 799\n• Family Feast Box (4 Biryani + 1 Handi + Salad): Rs. 2,199\n\nPromo Code 'WARI2026' use kar ke extra 10% discount hasil karein!`,
    };
  }

  // WhatsApp / Contact / Helpline
  if (
    text.includes("whatsapp") ||
    text.includes("phone") ||
    text.includes("number") ||
    text.includes("call") ||
    text.includes("rabta") ||
    text.includes("contact")
  ) {
    return {
      reply: `Aap hamari direct WhatsApp Helpline par rabta kar sakte hain: +92 370 1235559. Hamara order booking staff 24/7 online hai.`,
    };
  }

  // Politeness / Thanks
  if (
    text.includes("shukriya") ||
    text.includes("thanks") ||
    text.includes("thank you") ||
    text.includes("meherbani") ||
    text.includes("acha") ||
    text.includes("theek hai") ||
    text.includes("ok")
  ) {
    const thankName = currentUserName ? `${currentUserName} bhai` : "Janab";
    return {
      reply: `Bohat shukriya ${thankName}! Agar mazeed koi sawal ho to main hamesha hazir hoon. Mister Wari ka lazeez zaiqa zaroor enjoy karein!`,
    };
  }

  // Intelligent General Fallback
  return {
    reply: `Main sirf Mister Wari website ke related sawalon ka jawab deta hoon. Aap menu, branches, booking, order tracking, contact info, aur WhatsApp order process ke bare me pooch sakte hain. ${WEBSITE_ONLY_GUIDANCE}`,
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(localStorage.getItem("chatGuestName") || "");
  const [nameInput, setNameInput] = useState("");
  const [conversationId, setConversationId] = useState("mw_live_chat");
  const [messages, setMessages] = useState([
    {
      id: "welcome_1",
      sender_role: "admin",
      message:
        "Khush Aamdeed! Mister Wari Live Support mein aapka swagat hai. Main aapki kya madad kar sakta hoon?",
      time: "Just now",
    },
  ]);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState(0);

  const bottomRef = useRef(null);
  const guestId = getGuestId();

  useEffect(() => {
    function handleJoined({ conversation, messages: initialMsgs }) {
      if (conversation?.id) setConversationId(conversation.id);
      if (initialMsgs?.length) setMessages(initialMsgs);
    }

    function handleNewMessage(message) {
      setMessages((current) => [...current, message]);
      if (message.sender_role === "admin") {
        setUnread((u) => (open ? 0 : u + 1));
      }
    }

    try {
      socket.on("customer:joined", handleJoined);
      socket.on("chat:new-message", handleNewMessage);

      if (name) {
        socket.emit("customer:join", { guestId, guestName: name });
      }
    } catch (e) {}

    return () => {
      try {
        socket.off("customer:joined", handleJoined);
        socket.off("chat:new-message", handleNewMessage);
      } catch (e) {}
    };
  }, [name, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function startChat(e) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    localStorage.setItem("chatGuestName", nameInput.trim());
    setName(nameInput.trim());
  }

  function handleSendText(messageToSend) {
    const cleanText = messageToSend.trim();
    if (!cleanText) return;

    try {
      socket.emit("customer:message", {
        conversationId,
        text: cleanText,
      });
    } catch (e) {}

    // Smart Conversational AI Response (client-side simulated admin reply)
    setTimeout(() => {
      const { reply, detectedName } = generateSmartReply(cleanText, name);

      if (detectedName && !name) {
        setName(detectedName);
        localStorage.setItem("chatGuestName", detectedName);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender_role: "admin",
          message: reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 600);

    setText("");
  }

  function sendMessage(e) {
    e.preventDefault();
    handleSendText(text);
  }

  function toggleOpen() {
    setOpen((o) => !o);
    setUnread(0);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="w-[92vw] sm:w-96 h-[32rem] bg-[#120f0c] border border-gold/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden mb-4"
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-bgPanel2 via-[#221c16] to-bgPanel2 border-b border-line px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-gold to-ajrakRed flex items-center justify-center text-[#14110d] shadow-gold font-bold text-sm">
                  <UtensilsCrossed className="w-4 h-4 text-[#14110d]" />
                </div>
                <div>
                  <p className="font-anton text-cream tracking-wide text-base leading-none">
                    MISTER WARI LIVE
                  </p>
                  <p className="text-[11px] text-emerald-400 font-poppins flex items-center gap-1.5 mt-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Website Support
                  </p>
                </div>
              </div>

              <button
                onClick={toggleOpen}
                className="w-8 h-8 rounded-full bg-bg border border-line text-creamDim hover:text-gold flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* BODY */}
            {!name ? (
              <form
                onSubmit={startChat}
                className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
                  <MessageSquare className="w-7 h-7 text-gold" />
                </div>
                <div>
                  <h4 className="font-anton text-xl text-cream tracking-wide">
                    Website Support
                  </h4>
                  <p className="text-creamDim text-xs max-w-xs mt-1 font-poppins">
                    Hamari website se related sawal ke liye apna naam likhein.
                  </p>
                </div>

                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Aapka Naam (e.g. Hasan)"
                  required
                  className="w-full bg-bg border border-line rounded-2xl px-4 py-3.5 text-xs text-cream outline-none focus:border-gold font-poppins"
                />

                <button
                  type="submit"
                  className="w-full btn-gold py-3.5 rounded-full font-poppins text-xs font-bold uppercase tracking-wider shadow-gold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#14110d]" />
                  <span>Start Live Chat</span>
                </button>
              </form>
            ) : (
              <>
                {/* MESSAGES LIST */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => {
                    const isUser = m.sender_role === "customer";
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[84%] px-4 py-2.5 rounded-2xl text-xs font-inter leading-relaxed whitespace-pre-line ${
                            isUser
                              ? "bg-gradient-to-r from-gold to-yellow-400 text-[#14110d] font-semibold rounded-br-none shadow-sm"
                              : "bg-[#1d1813] border border-line text-cream rounded-bl-none shadow-sm"
                          }`}
                        >
                          {m.message}
                        </div>
                        {m.time && (
                          <span className="text-[9px] text-creamDim/60 font-poppins mt-0.5 px-1">
                            {m.time}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* QUICK SUGGESTIONS PILLS */}
                <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto border-t border-line/40 scrollbar-none bg-bg/60">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendText(prompt)}
                      className="px-3 py-1 rounded-full bg-bgPanel2 border border-line text-[11px] text-creamDim hover:text-gold hover:border-gold whitespace-nowrap transition-colors flex items-center gap-1 font-poppins"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-gold" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>

                {/* CHAT INPUT */}
                <form
                  onSubmit={sendMessage}
                  className="border-t border-line p-3 bg-bgPanel2/95 flex items-center gap-2"
                >
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-bg border border-line rounded-full px-4 py-2.5 text-cream text-xs outline-none focus:border-gold font-poppins"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-full btn-gold flex items-center justify-center text-[#14110d] shadow-sm flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOGGLE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gold to-ajrakRed text-[#14110d] flex items-center justify-center shadow-[0_10px_30px_rgba(229,169,34,0.4)] border border-gold/40"
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6 text-[#14110d]" />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-ajrakRed text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white/20 animate-bounce">
            {unread}
          </span>
        )}
      </motion.button>
    </div>
  );
}