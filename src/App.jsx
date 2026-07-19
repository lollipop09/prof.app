import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Lock, ArrowLeft, Plus, ShieldCheck, FileText, Image, Check } from "lucide-react";

// ---------------------------------------------------------------
// RELAY — messaging MVP prototype (demo only)
// Everything runs in memory: fake auth, fake 2FA, simulated replies.
// ---------------------------------------------------------------

const DEMO_CODE = "246810";

const seedContacts = [
  { id: "sam", name: "Sam Rivera", status: "online" },
  { id: "priya", name: "Priya Nair", status: "last seen 2h ago" },
];

const seedMessages = {
  sam: [
    { from: "them", type: "text", text: "Hey! Did you get the draft I sent?", time: "10:02" },
    { from: "me", type: "text", text: "Just opened it — looks great so far.", time: "10:05" },
  ],
  priya: [
    { from: "them", type: "text", text: "Meeting moved to 3pm tomorrow.", time: "Yesterday" },
  ],
};

const cannedReplies = [
  "Got it, thanks!",
  "Sounds good 👍",
  "Nice — received on my end.",
  "Perfect, I'll take a look.",
  "Ha, okay. Talk soon!",
];

function nowTime() {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
}

// ------------------------- Login -------------------------------
function LoginScreen({ onNext }) {
  const [name, setName] = useState("");
  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="w-14 h-14 rounded-2xl bg-teal-700 flex items-center justify-center mb-4 rotate-3">
        <Send className="text-white w-7 h-7 -rotate-3" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Relay</h1>
      <p className="text-slate-500 text-sm mb-8">One place to talk. This is a demo build.</p>

      <div className="w-full max-w-xs">
        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onNext(name.trim())}
          placeholder="e.g. Alex"
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
        />
        <button
          onClick={() => name.trim() && onNext(name.trim())}
          disabled={!name.trim()}
          className="mt-4 w-full rounded-xl bg-teal-700 text-white py-3 font-medium disabled:opacity-40 hover:bg-teal-800 transition-colors"
        >
          Continue
        </button>
        <p className="mt-6 text-xs text-slate-400 text-center flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Demo: no real account is created
        </p>
      </div>
    </div>
  );
}

// ------------------------- 2FA ---------------------------------
function TwoFactorScreen({ onVerify }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (code === DEMO_CODE) onVerify();
    else setError(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
        <ShieldCheck className="text-teal-700 w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Two-step verification</h2>
      <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">
        Enter the 6-digit code we "sent" to your device.
      </p>

      <div className="mb-4 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        Demo code: <span className="font-mono font-bold">{DEMO_CODE}</span>
      </div>

      <input
        value={code}
        onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(false); }}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="••••••"
        className={`w-40 text-center text-2xl tracking-widest font-mono rounded-xl border px-4 py-3 bg-white focus:outline-none focus:ring-2 ${
          error ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:ring-teal-600"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-2">That code doesn't match. Try {DEMO_CODE}.</p>}

      <button
        onClick={submit}
        disabled={code.length !== 6}
        className="mt-4 w-40 rounded-xl bg-teal-700 text-white py-2.5 font-medium disabled:opacity-40 hover:bg-teal-800 transition-colors"
      >
        Verify
      </button>
    </div>
  );
}

// ------------------------- Contacts ----------------------------
function ContactsScreen({ user, contacts, messages, onOpenChat, onAddContact }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const add = () => {
    if (!newName.trim()) return;
    onAddContact(newName.trim());
    setNewName("");
    setAdding(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Chats</h2>
          <p className="text-xs text-slate-400">Signed in as {user} · encrypted in transit</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800 transition-colors"
          aria-label="Add contact"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {adding && (
        <div className="mx-5 mb-3 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Contact name"
            autoFocus
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button onClick={add} className="px-4 rounded-xl bg-teal-700 text-white text-sm font-medium hover:bg-teal-800">
            Add
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {contacts.map((c) => {
          const thread = messages[c.id] || [];
          const last = thread[thread.length - 1];
          return (
            <button
              key={c.id}
              onClick={() => onOpenChat(c.id)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white transition-colors text-left border-b border-slate-100"
            >
              <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 shrink-0">
                {c.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-slate-900 truncate">{c.name}</span>
                  {last && <span className="text-xs text-slate-400 ml-2 shrink-0">{last.time}</span>}
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {last
                    ? last.type === "file"
                      ? `📎 ${last.fileName}`
                      : (last.from === "me" ? "You: " : "") + last.text
                    : "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------- Chat --------------------------------
function ChatScreen({ contact, thread, onBack, onSend, onSendFile, typing }) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread, typing]);

  const send = () => {
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 py-3 flex items-center gap-3 bg-white border-b border-slate-200">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100" aria-label="Back">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600">
          {contact.name[0]}
        </div>
        <div>
          <div className="font-semibold text-slate-900 leading-tight">{contact.name}</div>
          <div className="text-xs text-teal-700">{typing ? "typing…" : contact.status}</div>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
          <Lock className="w-3 h-3" /> encrypted
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {thread.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                m.from === "me"
                  ? "bg-teal-700 text-white rounded-br-sm"
                  : "bg-white text-slate-800 rounded-bl-sm"
              }`}
            >
              {m.type === "file" ? (
                <span className="flex items-center gap-2">
                  {m.fileName.match(/\.(png|jpe?g|gif)$/i) ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  <span className="underline underline-offset-2">{m.fileName}</span>
                </span>
              ) : (
                m.text
              )}
              <span className={`block text-right text-[10px] mt-0.5 ${m.from === "me" ? "text-teal-100" : "text-slate-400"}`}>
                {m.time}
                {m.from === "me" && <Check className="inline w-3 h-3 ml-0.5 -mt-0.5" />}
              </span>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm text-slate-400 text-sm">
              <span className="animate-pulse">● ● ●</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-3 py-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onSendFile(f.name);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message"
          className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center disabled:opacity-40 hover:bg-teal-800 transition-colors"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ------------------------- App shell ---------------------------
export default function RelayPrototype() {
  const [screen, setScreen] = useState("login"); // login → 2fa → app
  const [user, setUser] = useState("");
  const [contacts, setContacts] = useState(seedContacts);
  const [messages, setMessages] = useState(seedMessages);
  const [activeChat, setActiveChat] = useState(null);
  const [typing, setTyping] = useState(false);

  const pushMessage = (contactId, msg) => {
    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), msg],
    }));
  };

  const simulateReply = (contactId) => {
    setTyping(true);
    const delay = 900 + Math.random() * 900;
    setTimeout(() => {
      setTyping(false);
      pushMessage(contactId, {
        from: "them",
        type: "text",
        text: cannedReplies[Math.floor(Math.random() * cannedReplies.length)],
        time: nowTime(),
      });
    }, delay);
  };

  const handleSend = (text) => {
    pushMessage(activeChat, { from: "me", type: "text", text, time: nowTime() });
    simulateReply(activeChat);
  };

  const handleSendFile = (fileName) => {
    pushMessage(activeChat, { from: "me", type: "file", fileName, time: nowTime() });
    simulateReply(activeChat);
  };

  const handleAddContact = (name) => {
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setContacts((prev) => [...prev, { id, name, status: "online" }]);
  };

  const contact = contacts.find((c) => c.id === activeChat);

  return (
    <div className="w-full h-screen bg-slate-200 flex items-center justify-center p-0 sm:p-6 font-sans">
      {/* Phone frame */}
      <div className="w-full h-full sm:w-[390px] sm:h-[780px] sm:max-h-full bg-slate-50 sm:rounded-[2rem] sm:shadow-2xl overflow-hidden flex flex-col sm:border-8 sm:border-slate-900">
        {screen === "login" && (
          <LoginScreen
            onNext={(name) => {
              setUser(name);
              setScreen("2fa");
            }}
          />
        )}
        {screen === "2fa" && <TwoFactorScreen onVerify={() => setScreen("app")} />}
        {screen === "app" && !activeChat && (
          <ContactsScreen
            user={user}
            contacts={contacts}
            messages={messages}
            onOpenChat={setActiveChat}
            onAddContact={handleAddContact}
          />
        )}
        {screen === "app" && activeChat && contact && (
          <ChatScreen
            contact={contact}
            thread={messages[activeChat] || []}
            typing={typing}
            onBack={() => setActiveChat(null)}
            onSend={handleSend}
            onSendFile={handleSendFile}
          />
        )}
      </div>
    </div>
  );
}
