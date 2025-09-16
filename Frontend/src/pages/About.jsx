export default function About() {
  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Me</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Sharing <span className="text-[#00adb5]">stories</span>,{" "}
          <span className="text-[#00adb5]">knowledge</span>, and{" "}
          <span className="text-[#00adb5]">creativity</span> with the world.
        </p>
      </section>

      {/* Main About Content */}
      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">
          My Blogging Journey
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-10">
          Hello! I’m a passionate blogger who loves writing about technology,
          design, and lifestyle. This blog started as a small journal, but
          quickly grew into a platform where I can share my ideas, tutorials,
          and experiences with people around the globe.
        </p>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold text-[#0f3460] mb-3">
              🌟 Mission
            </h3>
            <p className="text-gray-600">
              To inspire and educate readers by sharing authentic content,
              creative tutorials, and insightful stories.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold text-[#0f3460] mb-3">
              🚀 Vision
            </h3>
            <p className="text-gray-600">
              To build a community of curious minds who learn, grow, and create
              together through blogging.
            </p>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="bg-[#f8f9fa] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Author"
            className="w-32 h-32 mx-auto rounded-full border-4 border-[#00adb5] shadow-md mb-6"
          />
          <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">
            Hi, I’m Geshan 👋
          </h3>
          <p className="text-gray-700 mb-4">
            A blogger, developer, and designer who loves sharing knowledge and
            building digital experiences.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-6 text-[#00adb5] text-xl">
            <a href="#" className="hover:text-[#08c4cc]">🐦 Twitter</a>
            <a href="#" className="hover:text-[#08c4cc]">💼 LinkedIn</a>
            <a href="#" className="hover:text-[#08c4cc]">📸 Instagram</a>
          </div>
        </div>
      </section>
    </main>
  );
}
