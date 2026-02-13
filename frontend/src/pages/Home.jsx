import React from "react";
import { Link } from "react-router-dom";
import {
  BuildingLibraryIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import useToken from "../context/token";

const Home = () => {
  const { tokenId } = useToken();
  return (
    <div className="pt-14 bg-[#e8fff0] dark:bg-slate-900 min-h-screen px-6 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto py-12 flex flex-col gap-20">
        {/* Hero Section */}
        <section className="text-center dark:bg-gray-800 bg-emerald-200  rounded-md py-18 px-4">
          <h1 className="text-5xl font-bold mb-6 text-green-500 animate-pulse">
            Smart Waste Management System
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
            Revolutionizing waste management by connecting municipalities,
            citizens, cleaning teams, and upcycling industries. Together, we
            build a greener future!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="/tasks"
              className="px-6 py-3 bg-green-500 text-slate-950 rounded-xl font-semibold hover:bg-green-400 transition"
            >
              View Tasks
            </a>
            <a
              href="/stats"
              className="px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl font-semibold hover:bg-emerald-400 transition"
            >
              Analyze Report
            </a>
          </div>
        </section>

        {/* User Roles Section */}
        <section id="roles">
          <h2 className="text-4xl font-bold text-center mb-14 text-blue-700 dark:text-green-400">
            Our Key Stakeholders
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Municipality/Admin Card */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-center">
              <BuildingLibraryIcon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Municipality (Admin)
              </h3>
              <p className="mb-4 dark:text-slate-400 text-slate-700">
                Manage complaints, assign tasks, monitor cleanliness, and
                generate revenue through sustainable partnerships.
              </p>
              <Link
                to="/about"
                className="text-green-600 font-semibold underline"
              >
                Learn More
              </Link>
            </div>

            {/* Citizen/User Card */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-center">
              <UserGroupIcon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Citizen (User)
              </h3>
              <p className="mb-4 dark:text-slate-400 text-slate-700">
                Report dumps, sell recyclables, lodge complaints, and contribute
                towards a cleaner community while earning rewards!
              </p>
              <Link
                to="/about"
                className="text-green-600 font-semibold underline"
              >
                Learn More
              </Link>
            </div>

            {/* Cleaning Team Card */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-center">
              <SparklesIcon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Cleaning Team
              </h3>
              <p className="mb-4 dark:text-slate-400 text-slate-700">
                Respond to assigned tasks, maintain cleanliness standards, and
                earn recognition for excellent service.
              </p>
              <Link
                to="/about"
                className="text-green-600 font-semibold underline"
              >
                Learn More
              </Link>
            </div>

            {/* Upcycling Industry Card */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-center">
              <ArrowPathIcon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Upcycling Industry
              </h3>
              <p className="mb-4 dark:text-slate-400 text-slate-700">
                Access leftover and expired products at lower costs due to
                efficient logistics partnerships with municipalities.
              </p>
              <Link
                to="/about"
                className="text-green-600 font-semibold underline"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Report and Complaint Section */}
        {/* Collaboration Section */}
        <section
          id="collaboration"
          className="bg-emerald-200 dark:bg-slate-800 p-10 rounded-2xl text-center shadow-lg w-full transition-transform duration-300 hover:scale-105"
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-green-400">
            Collaborate for a Greener Tomorrow 🌍
          </h2>
          {!tokenId ? (
            <p className="dark:text-slate-400 text-slate-700 mb-8">
              Eco Pulse invites municipalities, industries, and citizens to
              co-create sustainable solutions for waste management.
            </p>
          ) : (
            <p className="dark:text-slate-400 text-slate-700 mb-8">
              Join our mission and share your achivements and motivate others to
              contribute towards nature.
            </p>
          )}
          {!tokenId ? (
            <a
              href="#"
              className="px-6 py-3 dark:bg-emerald-500 bg-green-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition"
            >
              Join Our Mission
            </a>
          ) : (
            <a
              href="#"
              className="px-6 py-3 dark:bg-emerald-500 bg-green-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition"
            >
              Share Your Story
            </a>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
