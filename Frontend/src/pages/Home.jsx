import { motion } from "framer-motion";

export default function Home() {
  const posts = [
    {
      title: "How to Start Blogging",
      desc: "A quick dive into tips, tricks, and inspiration for creators.",
      img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80", // blogging image
    },
    {
      title: "Top 10 React Tips",
      desc: "Best practices for React developers to level up their apps.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80", // coding image
    },
    {
      title: "Design Trends 2025",
      desc: "Explore modern design patterns and trends to stay ahead.",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80", // design image
    },
  ];

  return (
    <main className="text-white">
      {/* Hero Section */}
      <section
        className="h-[80vh] flex flex-col justify-center items-center text-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <motion.div
          className="relative z-10 px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Welcome to{" "}
            <span className="text-[#00adb5] drop-shadow-lg">Bloger</span>
          </h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-6 text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Discover{" "}
            <span className="text-[#00adb5]">ideas</span>,{" "}
            <span className="text-[#00adb5]">tutorials</span>, and{" "}
            <span className="text-[#00adb5]">thoughts</span> that inspire
            creativity.
          </motion.p>
          <motion.a
            href="#blogs"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00adb5] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#08c4cc] transition-all shadow-lg hover:shadow-[#00adb5]/50 inline-block"
          >
            Explore Posts
          </motion.a>
        </motion.div>
      </section>

      {/* Featured Posts Section */}
      <section
        id="blogs"
        className="bg-[#1a1a2e] py-20 px-6 md:px-12 relative overflow-hidden"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative z-10">
          Featured Posts
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              className="bg-[#16213e] rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
              whileHover={{ scale: 1.05, rotate: -1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#00adb5] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-300 mb-4">{post.desc}</p>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-[#00adb5] font-semibold"
                >
                  Read More →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
  <section className="bg-gradient-to-r from-[#0f3460] to-[#16213e] py-20 flex justify-center items-center">
  <motion.div
    className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 w-full max-w-3xl text-center shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <motion.h2
      className="text-3xl md:text-4xl font-bold mb-6 text-white"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Stay Updated with Our Latest Posts
    </motion.h2>
    <motion.p
      className="mb-8 text-gray-300 text-lg"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Subscribe to our newsletter and get the latest content directly to your inbox.
    </motion.p>

    <motion.form
      className="flex flex-col sm:flex-row justify-center items-center gap-4"
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full sm:flex-1 px-5 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 outline-none shadow-md focus:ring-4 focus:ring-[#00adb5]"
      />
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 0px 20px #00adb5",
        }}
        className="bg-[#00adb5] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#08c4cc] transition-all shadow-md"
      >
        Subscribe
      </motion.button>
    </motion.form>

    <p className="mt-4 text-gray-400 text-sm">
      We respect your privacy. No spam ever.
    </p>
  </motion.div>
</section>


    </main>
  );
}
