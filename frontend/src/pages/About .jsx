import React from "react";
import {
  Users,
  Building2,
  ShieldCheck,
  DollarSign,
  Star,
  AlertCircle,
  HandCoins,
  MapPin,
  LineChart,
  BrainCircuit,
  Zap,
  MessageSquare,
  BadgeCheck,
  Coins,
  TrendingUp,
  Package,
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="pt-16 bg-[#e8fff0] dark:bg-slate-900 min-h-screen px-6 text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto flex flex-col gap-16 py-12">

        {/* Hero Introduction */}
        <section className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-green-500 flex items-center justify-center gap-2">
            <Users className="w-8 h-8" /> About Eco-Pulse
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
            <span className="font-semibold">Eco-Pulse</span> is a smart, AI-enriched municipal
            waste management and environmental monitoring platform. It bridges
            the gap between <span className="font-semibold">civic responsibility</span>,{" "}
            <span className="font-semibold">municipal administration</span>, and{" "}
            <span className="font-semibold">ground-level sanitation services</span> -
            creating a synchronized, closed-loop workflow that ensures public
            waste heaps are reported, verified, assigned, and cleaned efficiently.
          </p>
        </section>

        {/* The Real Problem */}
        <section className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-600 dark:text-green-400 flex justify-center items-center gap-2">
            <AlertCircle className="w-7 h-7" /> The Real-World Problem
          </h2>
          <p className="mb-4 text-lg">
            Traditional waste management systems in most urban areas are{" "}
            <span className="font-semibold">highly reactive, non-transparent, and operationally inefficient.</span>
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Citizen Disconnection:</span></span> Citizens have no direct or transparent way to report open garbage dumps, overflowing bins, or environmental hazards.
            </li>
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Administrative Blindspots:</span></span> Municipalities lack real-time visibility into the geographical distribution of waste piles, leading to inefficient scheduling and slow responses.
            </li>
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Operational Inefficiencies:</span></span> Cleaning teams are deployed randomly or on fixed routes rather than directed to areas of high severity, resulting in neglected trouble zones.
            </li>
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">No Incentive Structure:</span></span> Citizens lack any motivation or rewards for reporting issues, keeping them disengaged from civic responsibility.
            </li>
          </ul>
        </section>

        {/* How Eco-Pulse Solves It */}
        <section className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-600 dark:text-green-400 flex justify-center gap-2 items-center">
            <BrainCircuit className="w-7 h-7" /> How Eco-Pulse Solves It
          </h2>
          <ul className="list-disc list-inside space-y-4 text-lg">
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Gemini Vision AI Verification:</span></span> Every dump photo is automatically analyzed by Google's Gemini Vision API — classifying waste type (Plastic, Organic, Hazardous, E-Waste), rating severity on a 1–10 scale, and generating a confidence score. Spam is eliminated without human intervention.
            </li>
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Eco-Credits Gamification:</span></span> Citizens earn 10 Eco-Credits every time the AI confirms their report as genuine waste, turning civic monitoring into an engaging, sustained activity.
            </li>
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Haversine Proximity Routing:</span></span> The backend calculates the exact distance (in km) between each cleaning team's registered location and the dump using the Haversine formula — ensuring the nearest team is always dispatched first.
            </li>
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Async SMS Queue (BullMQ + Redis):</span></span> All SMS alerts are processed via a BullMQ job queue backed by Redis. The API responds instantly while notifications are delivered reliably with up to 3× automatic retry.
            </li>
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">PrakritiAI Chatbot:</span></span> An embedded Gemini-powered chatbot trained on sustainability topics, providing eco-tips, platform guidance, and waste management advice with exponential backoff retry for stability.
            </li>
            <li>
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Closed-Loop Verification:</span></span> Cleaning teams upload photographic proof of the cleaned location, updating the task status in real time for full transparency.
            </li>
          </ul>
        </section>

        {/* Key Stakeholders */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-blue-600 dark:text-green-400 text-center flex justify-center gap-2 items-center">
            <ShieldCheck className="w-7 h-7" /> Our Key Stakeholders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">

            {/* Citizens */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-[17px]">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <Users /> Citizens (Users)
              </h3>
              <p className="mb-2">
                • Report dump locations with a photo & GPS coordinates.<br />
                • Earn 10 Eco-Credits per AI-verified waste report.<br />
                • Lodge complaints for bin issues or municipal inaction.<br />
                • List recyclable items for pickup requests.<br />
                • Track dump status and receive SMS confirmations.
              </p>
              <h4 className="text-lg font-semibold mt-4 text-blue-700 flex items-center gap-2">
                <AlertCircle /> Why Join Us?
              </h4>
              <ul className="list-disc list-inside">
                <li>Earn Eco-Credits for every genuine dump report.</li>
                <li>Direct benefits by participating in a cleaner neighborhood.</li>
                <li>Monetary gains when selling recyclable waste to industries.</li>
                <li>Be part of a larger eco-friendly civic movement.</li>
              </ul>
            </div>

            {/* Admin */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-[17px]">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <Building2 /> Admin (Municipality)
              </h3>
              <p className="mb-2">
                • View all reported dumps on a real-time geospatial map.<br />
                • Assign tasks to the nearest cleaning team via proximity routing.<br />
                • Monitor district-wide cleanliness metrics and completion stats.<br />
                • Access AI-generated waste classification and severity data.
              </p>
              <h4 className="text-lg font-semibold mt-4 text-blue-700 flex items-center gap-2">
                <AlertCircle /> Why Join Us?
              </h4>
              <ul className="list-disc list-inside">
                <li>Increase city cleanliness ratings nationally.</li>
                <li>Efficient waste management with minimal resources.</li>
                <li>Earn revenue through upcycling industry partnerships.</li>
                <li>Digitalize and modernize municipal operations.</li>
              </ul>
            </div>

            {/* Cleaning Team */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-[17px]">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <ShieldCheck /> Cleaning Team
              </h3>
              <p className="mb-2">
                • Receive SMS task alerts with address and distance.<br />
                • View all assigned active tasks on the dashboard.<br />
                • Upload photographic proof of task completion.<br />
                • Benefit from proximity-optimized workload distribution.
              </p>
              <h4 className="text-lg font-semibold mt-4 text-blue-700 flex items-center gap-2">
                <AlertCircle /> Why Join Us?
              </h4>
              <ul className="list-disc list-inside">
                <li>Transparent and efficient task assignments.</li>
                <li>Recognition for good work performance.</li>
                <li>Additional earning opportunities through bonuses.</li>
                <li>Better scheduling and workload management via technology.</li>
              </ul>
            </div>

            {/* Upcycling Industry */}
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-[17px]">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <Package /> Upcycling Industry
              </h3>
              <p className="mb-2">
                • Access platform-listed recyclable materials from citizens.<br />
                • Pay for priority access and logistics partnerships.<br />
                • Convert waste into new, valuable products at lower cost.<br />
                • Expand operations with a guaranteed, sustainable supply.
              </p>
              <h4 className="text-lg font-semibold mt-4 text-blue-700 flex items-center gap-2">
                <AlertCircle /> Why Join Us?
              </h4>
              <ul className="list-disc list-inside">
                <li>Access to cheap, sorted raw materials.</li>
                <li>Low logistics cost due to municipal partnership.</li>
                <li>Guaranteed material supply without heavy sourcing effort.</li>
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
          <p className="mb-4">
            Eco-Pulse operates on a multi-stream revenue model where every stakeholder benefits economically.
          </p>
          <ul className="list-disc list-inside space-y-3">
            <li className="text-lg">
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Platform Service Charges (SaaS):</span></span>{" "}
              Municipalities pay a subscription fee to access the Eco-Pulse dashboard, geospatial tools, AI-verified dump data, and team management features - scaled per district or city population.
            </li>
            <li className="text-lg">
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">AI Waste Data Analytics Licensing:</span></span>{" "}
              The platform accumulates rich, geospatially tagged, AI-classified waste data. This anonymized dataset is licensed to research institutions, environmental NGOs, urban planning bodies, and private sanitation companies as paid intelligence reports.
            </li>
            <li className="text-lg">
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Recyclable Material Marketplace:</span></span>{" "}
              Citizens list recyclable items (plastic bundles, e-waste, organic waste) on the platform. Upcycling industries pay to access and collect them. Eco-Pulse earns a transaction commission on every successful pickup while citizens receive direct income.
            </li>
            <li className="text-lg">
              <span className=""><span className="font-bold text-blue-600 dark:text-blue-500 ">Upcycling Industry Partnerships:</span></span>{" "}
              Recycling companies pay for priority access, featured listings, and logistics partnerships within the platform. Municipalities reduce hauling costs by diverting sorted waste directly to industry - and Eco-Pulse earns a partnership fee for orchestrating this supply chain.
            </li>
          </ul>
        </section>

        {/* Feasibility and Market Fit */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-green-400 flex items-center justify-center gap-2">
            <LineChart /> Why Our Platform is the Future?
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-400 max-w-3xl mx-auto">
            • Unprecedented urban waste growth demands AI-powered, real-time monitoring.<br />
            • Rising environmental awareness drives sustained citizen participation via Eco-Credits.<br />
            • Circular economy policies globally mandate tech-driven waste diversion and tracking.<br />
            • The Haversine routing model eliminates fuel waste and cuts operational costs.<br />
            • BullMQ + Redis ensures zero dropped notifications even under high load, with retries.<br />
            • A single scalable codebase can be onboarded city by city - low cost, high impact.
          </p>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
