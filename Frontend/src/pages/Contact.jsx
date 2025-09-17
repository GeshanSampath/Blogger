import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Sending...");

    try {
      await axios.post(`${API}/contact`, form);
      setStatus("✅ Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send message. Try again later.");
    }
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0f3460] via-[#16213e] to-[#1a1a2e] text-white py-20 px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,173,181,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_60%)]"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left Side - Contact Info */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Get in <span className="text-[#00adb5]">Touch</span>
          </h2>
          <p className="text-gray-300">
            We’d love to hear from you! Whether you have a question, feedback, or just want to say hi,
            feel free to drop a message below.
          </p>

          <div className="space-y-6">
            {[{
              icon: <Mail className="text-[#00adb5]" size={28} />,
              title: "Email",
              info: "support@myblog.com",
            },{
              icon: <Phone className="text-[#00adb5]" size={28} />,
              title: "Phone",
              info: "+94 77 123 4567",
            },{
              icon: <MapPin className="text-[#00adb5]" size={28} />,
              title: "Location",
              info: "Colombo, Sri Lanka",
            }].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-[#00adb5]/20 p-3 rounded-xl">{item.icon}</div>
                <div>
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-gray-300">{item.info}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg space-y-6 w-full"
        >
          <h3 className="text-2xl font-semibold text-center text-[#00adb5]">
            Send Us a Message
          </h3>
          <input
            type="text"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300/30 bg-white/5 text-white focus:ring-2 focus:ring-[#00adb5] outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300/30 bg-white/5 text-white focus:ring-2 focus:ring-[#00adb5] outline-none"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300/30 bg-white/5 text-white focus:ring-2 focus:ring-[#00adb5] outline-none"
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-[#00adb5] text-black py-3 rounded-lg font-semibold hover:bg-[#08c4cc] transition-all shadow-md hover:shadow-[#00adb5]/40"
          >
            Send Message
          </motion.button>
          {status && (
            <p className="text-center mt-4 text-sm text-gray-300">{status}</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
