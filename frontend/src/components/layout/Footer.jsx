import { API_BASE_URL } from "../../utils/api";
import NovaLogo from "../../assets/novaos-logo.svg";
import { FaGithub, FaLinkedin, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

/* ================= EMAIL VALIDATION ONLY ================= */

const isValidEmail = (email) => {
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const blockedPrefixes = ["test", "fake", "demo", "temp"];
  const disposableDomains = [
    "mailinator.com",
    "10minutemail.com",
    "tempmail.com",
    "guerrillamail.com",
  ];

  if (!basicRegex.test(email)) return false;

  const [local, domain] = email.toLowerCase().split("@");

  if (blockedPrefixes.some((p) => local.startsWith(p))) return false;
  if (disposableDomains.includes(domain)) return false;

  return true;
};

/* ========================================================= */

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const sendFeedback = async (e) => {
    e.preventDefault();
    setError(false);

    // ✅ STRICT EMAIL CHECK ONLY
    if (!isValidEmail(email)) {
      setError("❌ Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      setSent(true);
      setEmail("");
      setMessage("");

      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <footer className="w-full bg-[#020617] border-t border-white/10">
      <div className="w-full px-6 sm:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* LEFT */}
        <div className="text-center md:text-left">
          <img
            src={NovaLogo}
            alt="NovaOS Logo"
            className="h-10 mb-3 mx-auto md:mx-0 opacity-90 drop-shadow-[0_0_10px_rgba(99,102,241,0.45)]"
          />

          <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0 wrap-break-word">
            Build habits. Track life. Think clearly.
            <span className="block mt-1">
              Your personal operating system powered by AI.
            </span>
          </p>
        </div>

        {/* CENTER */}
        <div>
          <p className="text-sm font-semibold text-gray-300 mb-4 text-center">
            Connect with me
          </p>

          <div className="flex gap-6 items-center justify-center flex-wrap">
            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.25, rotate: 6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-gray-400 hover:text-white text-xl cursor-pointer"
                title={s.label}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* RIGHT – FEEDBACK */}
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-gray-300 mb-3">
            Feedback / Suggestions
          </p>

          <p className="text-xs text-gray-400 mb-3">
            Positive ya negative — sab welcome hai 💜
          </p>

          {sent ? (
            <p className="text-green-400 text-sm">
              ✅ Thank you for your valuable feedback!
            </p>
          ) : (
            <form onSubmit={sendFeedback} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
                className="w-full bg-white/5 px-3 py-2 rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Write your feedback..."
                  className="flex-1 bg-white/5 px-3 py-2 rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
                >
                  Send
                </button>
              </div>
            </form>
          )}

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} • Built with ❤️ by Vishal
      </div>
    </footer>
  );
}

const socials = [
  { icon: <FaGithub />, label: "GitHub", link: "https://github.com/CodeJungleExplorer" },
  { icon: <FaLinkedin />, label: "LinkedIn", link: "https://www.linkedin.com/in/vishal-pandey-501223235" },
  { icon: <FaInstagram />, label: "Instagram", link: "https://www.instagram.com/vishal4_uy" },
  { icon: <FaPhoneAlt />, label: "Phone", link: "tel:+918890525088" },
];
