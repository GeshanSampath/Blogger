import { Users, Target, Lightbulb, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Our Blog</h1>
          <p className="text-xl text-blue-100">
            Sharing insights, stories, and knowledge to inspire and educate our community
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
          <p className="text-lg text-slate-700 mb-4">
            Welcome to our blog! We started this platform with a simple mission: to create a space where ideas flow freely and knowledge is shared openly. What began as a passion project has grown into a vibrant community of readers and thinkers.
          </p>
          <p className="text-lg text-slate-700">
            We believe that great writing has the power to inform, inspire, and transform. Whether you're here to learn something new, find different perspectives, or simply enjoy engaging content, we're thrilled to have you as part of our journey.
          </p>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Repeat for each value card */}
            <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Quality Content</h3>
                  <p className="text-slate-700">
                    We're committed to publishing thoughtful, well-researched articles that provide real value to our readers.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Innovation</h3>
                  <p className="text-slate-700">
                    We explore fresh ideas and perspectives, always looking to push boundaries and think differently.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-green-600">
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Community</h3>
                  <p className="text-slate-700">
                    We foster an inclusive community where diverse voices are heard, valued, and celebrated.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-orange-600">
              <div className="flex items-start gap-4">
                <Mail className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Transparency</h3>
                  <p className="text-slate-700">
                    We believe in honest communication and genuine connection with our readers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-lg text-blue-100 mb-6">
            Have a question or want to collaborate? We'd love to hear from you!
          </p>
          {/* Link to Contact page */}
          <Link
            to="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
