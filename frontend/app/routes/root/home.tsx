import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: "Agile Boards",
    desc: "Visualize your workflow with drag-and-drop Kanban boards and customizable columns.",
    icon: "📊",
  },
  {
    title: "Team Collaboration",
    desc: "Assign tasks, comment, and mention teammates for seamless teamwork.",
    icon: "🤝",
  },
  {
    title: "Real-Time Updates",
    desc: "Instant notifications and live updates keep everyone on the same page.",
    icon: "⚡",
  },
  {
    title: "Advanced Reporting",
    desc: "Track progress with insightful charts, productivity stats, and trends.",
    icon: "📈",
  },
  {
    title: "Role Management",
    desc: "Flexible permissions for admins, managers, and contributors.",
    icon: "🔐",
  },
  {
    title: "Smart Integrations",
    desc: "Connect with your favorite tools and automate your workflow.",
    icon: "🔗",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Product Manager",
    text: "Orbit transformed our team's productivity. The Kanban boards and real-time updates keep everyone aligned and motivated!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul Mehta",
    role: "Tech Lead",
    text: "The reporting and integrations are top-notch. We shipped our last project 30% faster using Orbit.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-6xl mx-auto w-full">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="text-blue-600">Orbit</span>
            <br />
            <span className="text-indigo-500">Agile Project Management</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl">
            Organize, track, and deliver your projects with ease. Orbit empowers teams to collaborate, plan sprints, and achieve goals—faster and smarter.
          </p>
          <div className="flex gap-4 mt-4">
            <Link to="/sign-in">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8 py-2 text-lg">
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-2 text-lg">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        {/* Right: Animation */}
        <div className="flex-1 flex justify-center items-center mt-10 md:mt-0">
          {/* Lottie Animation */}
          <lottie-player
            src="https://assets2.lottiefiles.com/packages/lf20_kyu7xb1v.json"
            background="transparent"
            speed="1"
            style={{ width: "320px", height: "320px" }}
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            Why Choose <span className="text-blue-600">Orbit</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 bg-blue-50 rounded-lg p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-700">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-8">
            How Orbit Works
          </h2>
          <ol className="space-y-6 text-lg text-gray-700 list-decimal list-inside">
            <li>
              <span className="font-semibold text-indigo-600">Create a workspace:</span> Invite your team and set up your first project.
            </li>
            <li>
              <span className="font-semibold text-indigo-600">Plan and assign:</span> Break work into tasks, assign owners, and set priorities.
            </li>
            <li>
              <span className="font-semibold text-indigo-600">Track progress:</span> Move tasks across boards, comment, and get real-time updates.
            </li>
            <li>
              <span className="font-semibold text-indigo-600">Analyze and deliver:</span> Use reports and insights to deliver projects on time.
            </li>
          </ol>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="bg-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Trusted by teams at</h3>
          <div className="flex flex-wrap justify-center gap-8 opacity-80">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" alt="TechVision" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-8" />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-8">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3" />
                <p className="text-gray-700 mb-2">"{t.text}"</p>
                <div className="font-semibold text-indigo-700">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to boost your team's productivity?</h2>
          <p className="text-lg text-blue-100 mb-6">
            Sign up now and start managing your projects the Orbit way!
          </p>
          <Link to="/sign-up">
            <Button size="lg" className="bg-white text-blue-700 font-bold px-10 py-3 text-lg shadow-lg hover:bg-blue-50">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 text-sm">
        &copy; {new Date().getFullYear()} Orbit. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;