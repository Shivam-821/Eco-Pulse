import React from "react";
import {
  Users,
  Building2,
  Recycle,
  ShieldCheck,
  DollarSign,
  Star,
  AlertCircle,
  HandCoins,
  MapPin,
  LineChart,
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="pt-16 dark:bg-slate-900 min-h-screen px-6 text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto flex flex-col gap-16 py-12">
        {/* About Us Introduction */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-green-500 flex items-center justify-center gap-2">
            <Users className="w-8 h-8" /> About Us
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-400">
            We are a passionate team of three innovators —{" "}
            <span className="font-semibold text-green-400">Shivam Raj</span>,{" "}
            <span className="font-semibold text-green-400">Abhinav Patra</span>,
            and{" "}
            <span className="font-semibold text-green-400">Barkha Yadav</span>.
            <br />
            Our mission is simple yet powerful:{" "}
            <span className="font-semibold">
              Make cities cleaner, enable smarter waste management, and create
              an eco-friendly economy.
            </span>
          </p>
        </section>

        {/* Stakeholders Roles */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-blue-600 dark:text-green-400 text-center flex justify-center gap-2 items-center">
            <ShieldCheck className="w-7 h-7" /> Our Key Stakeholders
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin / Municipality */}
                  <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                    <Building2 /> Admin (Municipality)
                    </h3>
                    <p className="mb-2">
                    • Manage and monitor cleanliness across the city.
                    <br />
                    • Assign and track cleanup operations.
                    <br />
                    • Analyze waste management data for better planning.
                    <br />
                    • Generate revenue by selling analyzed waste data to industries and researchers.
                    </p>
                    <h4 className="text-lg font-semibold mt-4 text-blue-700 flex items-center gap-2">
                    <AlertCircle /> Why Join Us?
                    </h4>
                    <ul className="list-disc list-inside">
                    <li>Increase city cleanliness ratings nationally.</li>
                    <li>Efficient waste management with minimal resources.</li>
                    <li>
                      Earn revenue through partnerships with upcycling industries.
                    </li>
                    <li>Digitalize and modernize municipal operations.</li>
                    <li>Additional revenue from data analytics and private cleaning services.</li>
                    <li>Facilitate private cleaning requests for individual properties.</li>
                    </ul>
                  </div>

                  {/* Common User */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <Users /> Common User (Citizen)
              </h3>
              <p className="mb-2">
                • Report waste dumps instantly.
                <br />
                • Sell recyclable or reusable materials.
                <br />• Participate actively in building cleaner cities.
              </p>
              <h4 className="text-lg font-semibold mt-4 text-blue-700 flex items-center gap-2">
                <AlertCircle /> Why Join Us?
              </h4>
              <ul className="list-disc list-inside">
                <li>Get rewards for contributing recyclable materials.</li>
                <li>
                  Direct benefits by participating in a cleaner neighborhood.
                </li>
                <li>
                  Monetary gains when selling waste to upcycling industries.
                </li>
                <li>Be part of a larger eco-friendly movement.</li>
              </ul>
            </div>

            {/* Cleaning Team */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <ShieldCheck /> Cleaning Team
              </h3>
              <p className="mb-2">
                • Respond to assigned tasks.
                <br />
                • Maintain real-time updates on task completion.
                <br />• Help keep surroundings clean and organized.
              </p>
              <h4 className="text-lg font-semibold mt-4 text-blue-700 flex items-center gap-2">
                <AlertCircle /> Why Join Us?
              </h4>
              <ul className="list-disc list-inside">
                <li>Transparent and efficient task assignments.</li>
                <li>Recognition for good work performance.</li>
                <li>Additional earning opportunities through bonuses.</li>
                <li>
                  Better scheduling and workload management via technology.
                </li>
              </ul>
            </div>

            {/* Upcycling Industry */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <Recycle /> Upcycling Industry
              </h3>
              <p className="mb-2">
                • Purchase leftover, expired, and reusable materials.
                <br />
                • Convert waste into new, valuable products.
                <br />• Expand your operations with sustainable practices.
              </p>
              <h4 className="text-lg font-semibold mt-4 text-blue-700 flex items-center gap-2">
                <AlertCircle /> Why Join Us?
              </h4>
              <ul className="list-disc list-inside">
                <li>Access to cheap raw materials.</li>
                <li>Low logistic cost due to municipal partnership.</li>
                <li>
                  Guaranteed material supply without heavy sourcing effort.
                </li>
                <li>Opportunities to expand green product offerings.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Revenue Model */}
        <section className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-500 flex justify-center items-center gap-2">
            <DollarSign /> Our Revenue Model
          </h2>
          <ul className="list-disc list-inside text-lg">
            <li>
              <span className="font-semibold text-blue-700">Municipality:</span>{" "}
              Earns revenue through upcycling partnerships and by reducing
              operational costs.
            </li>
            <li>
              <span className="font-semibold text-blue-700">Users:</span> Gain
              money by selling recyclable waste to industries.
            </li>
            <li>
              <span className="font-semibold text-blue-700">
                Upcycling Industry:
              </span>{" "}
              Saves big on raw material sourcing and increases profit margins.
            </li>
            <li>
              <span className="font-semibold text-blue-700">Our Team:</span>{" "}
              Earns through platform service charges, partnerships, and scaling
              the model to more cities.
            </li>
          </ul>
        </section>

        {/* Feasibility and Market Fit */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-green-400 flex items-center justify-center gap-2">
            <LineChart /> Why Our Platform is the Future?
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-400 max-w-3xl mx-auto">
            • Increasing urban waste problems demand smarter, tech-enabled
            solutions.
            <br />
            • Rising environmental awareness drives citizen participation.
            <br />
            • Upcycling and circular economy are growing industries globally.
            <br />
            • Government policies are supporting sustainable waste management.
            <br />
            • Partnership with municipalities offers unmatched logistics
            advantage.
            <br />
            • Our simple, scalable model can be expanded city by city.
            <br />• Low operating cost, high social impact = Great feasibility
            and demand!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
