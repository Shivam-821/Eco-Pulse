import React from "react";

const roles = [
  {
    title: "Admin (Municipality)",
    description:
      "Manage reports, assign cleanup teams, and monitor city cleanliness.",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    color: "text-green-400",
  },
  {
    title: "Cleaning Team",
    description:
      "Respond to assigned tasks, update status, and maintain clean surroundings.",
    img: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
    color: "text-emerald-400",
  },
  {
    title: "Common User",
    description:
      "Report waste dumps, lodge complaints, and help build a cleaner community.",
    img: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    color: "text-teal-400",
  },
];

const RoleCard = ({ img, title, description, color }) => (
  <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl text-center shadow-lg hover:shadow-green-400/30 hover:scale-105 transition duration-300">
    <img src={img} alt={title} className="w-24 h-24 mx-auto mb-4" />
    <h3 className={`text-xl font-bold mb-2 ${color}`}>{title}</h3>
    <p className="dark:text-slate-400 text-slate-700">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="pt-16 dark:bg-slate-900 ">
      <div className="text-slate-100 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section
          id="home"
          className="flex flex-col items-center justify-center text-center py-20 px-6 bg-emerald-200 dark:bg-slate-800 rounded"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600 dark:text-green-500 animate-pulse">
            Smart Waste Management System
          </h1>
          <p className="text-lg md:text-xl dark:text-slate-400 mb-8 max-w-2xl text-blue-900">
            Connecting municipalities, cleaning teams, and citizens to make our
            cities cleaner and greener.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#report"
              className="px-6 py-3 bg-green-500 text-slate-950 rounded-xl font-semibold hover:bg-green-400 transition"
            >
              Report Dump
            </a>
            <a
              href="#complain"
              className="px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl font-semibold hover:bg-emerald-400 transition"
            >
              Lodge Complaint
            </a>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-green-400 text-blue-700">
            Our Users
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <RoleCard key={index} {...role} />
            ))}
          </div>
        </section>

        {/* Report and Complaint Section */}
        <section id="actions" className="py-20 px-6 ">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-12">
            {/* Report Section */}
            <div
              id="report"
              className="bg-emerald-200 dark:bg-slate-800 p-8 rounded-2xl text-center shadow-lg w-full max-w-md hover:scale-105 transition"
            >
              <h2 className="text-2xl font-bold mb-4 dark:text-green-400 text-blue-700">
                Report a Dump
              </h2>
              <p className="dark:text-slate-400 mb-6 text-slate-700">
                Found an unattended waste site? Report it easily and help us act
                fast!
              </p>
              <a
                href="#"
                className="px-6 py-3 dark:bg-emerald-500 bg-green-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition"
              >
                Report Now
              </a>
            </div>

            {/* Complaint Section */}
            <div
              id="complain"
              className="bg-emerald-200 dark:bg-slate-800 p-8 rounded-2xl text-center shadow-lg w-full max-w-md hover:scale-105 transition"
            >
              <h2 className="text-2xl font-bold mb-4 dark:text-green-400 text-blue-700">
                Lodge a Complaint
              </h2>
              <p className="dark:text-slate-400 mb-6 text-slate-700">
                Facing any issues? Lodge a complaint, and we'll address it
                swiftly!
              </p>
              <a
                href="#"
                className="px-6 py-3 dark:bg-emerald-500 bg-green-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition"
              >
                Complain Now
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="dark:bg-slate-900 dark:text-white text-gray-900 py-6 text-center text-sm mt-auto">
          © 2025 Smart Waste Management. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Home;
