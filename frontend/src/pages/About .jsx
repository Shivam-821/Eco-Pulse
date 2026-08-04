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
          <p className="text-lg text-slate-700 dark:text-slate-400 max-w-3xl mx-auto">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Eco-Pulse</span> is a smart, AI-enriched municipal
            waste management and environmental monitoring platform. It bridges
            the gap between <span className="font-semibold">civic responsibility</span>,{" "}
            <span className="font-semibold">municipal administration</span>, and{" "}
            <span className="font-semibold">ground-level sanitation services</span> —
            creating a synchronized, closed-loop workflow that ensures public
            waste heaps are reported, verified, assigned, and cleaned efficiently.
          </p>
        </section>

        {/* The Real Problem */}
        <section className="bg-emerald-200 dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-red-500 flex justify-center items-center gap-2">
            <AlertCircle className="w-7 h-7" /> The Real-World Problem
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4 text-center">
            Traditional waste management systems in most urban areas are{" "}
            <span className="font-bold text-red-500">highly reactive, non-transparent, and operationally inefficient.</span>
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: "Citizen Disconnection",
                desc: "Citizens have no direct or transparent way to report open garbage dumps, overflowing bins, or environmental hazards.",
              },
              {
                title: "Administrative Blindspots",
                desc: "Municipalities lack real-time visibility into the geographical distribution of waste piles, leading to inefficient scheduling and slow responses.",
              },
              {
                title: "Operational Inefficiencies",
                desc: "Cleaning teams are deployed randomly or on fixed routes rather than directed to areas of high severity, resulting in neglected trouble zones.",
              },
              {
                title: "No Incentive Structure",
                desc: "Citizens lack any motivation or rewards for reporting issues, keeping them disengaged from civic responsibility.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white dark:bg-slate-700 p-4 rounded-xl border-l-4 border-red-400"
              >
                <h4 className="font-bold text-red-500 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How Eco-Pulse Solves It */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-green-600 dark:text-green-400 text-center flex justify-center gap-2 items-center">
            <BrainCircuit className="w-7 h-7" /> How Eco-Pulse Solves It
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
                title: "Gemini Vision AI Verification",
                desc: "Every dump photo is automatically analyzed by Google's Gemini Vision API. It classifies waste type (Plastic, Organic, Hazardous, E-Waste etc.), rates severity on a 1–10 scale, and sets a confidence score — eliminating spam reports without human intervention.",
              },
              {
                icon: <Coins className="w-5 h-5 text-yellow-500" />,
                title: "Eco-Credits Gamification",
                desc: "Citizens earn 10 Eco-Credits every time the AI confirms their report as genuine waste. This turns civic monitoring into an engaging, reward-driven activity that sustains long-term participation.",
              },
              {
                icon: <MapPin className="w-5 h-5 text-blue-500" />,
                title: "Haversine Proximity Routing",
                desc: "When an admin assigns a dump task, the backend calculates the exact distance (in km) between the cleaning team's registered coordinates and the dump location using the Haversine formula — ensuring the nearest team is always dispatched first.",
              },
              {
                icon: <Zap className="w-5 h-5 text-orange-500" />,
                title: "Async SMS Queue (BullMQ + Redis)",
                desc: "All SMS alerts (dump confirmations, team assignments, OTPs) are processed asynchronously via a BullMQ job queue backed by Redis. The API responds instantly while notifications are delivered reliably with up to 3× automatic retry.",
              },
              {
                icon: <MessageSquare className="w-5 h-5 text-green-500" />,
                title: "PrakritiAI Chatbot",
                desc: "An embedded Gemini-powered chatbot trained on sustainability topics. It provides real-time eco-tips, platform guidance, and waste management advice with exponential backoff retry logic for API stability.",
              },
              {
                icon: <BadgeCheck className="w-5 h-5 text-teal-500" />,
                title: "Closed-Loop Verification",
                desc: "Cleaning teams close the loop by uploading a photographic proof of the cleaned location. This updates the task status to 'completed' in real time, giving admins and citizens transparent accountability.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-emerald-200 dark:bg-slate-800 p-5 rounded-2xl shadow-md flex gap-4"
              >
                <div className="mt-1 shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Stakeholders */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-blue-600 dark:text-green-400 text-center flex justify-center gap-2 items-center">
            <ShieldCheck className="w-7 h-7" /> Three-Actor Ecosystem
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "Citizens (Users)",
                color: "border-green-400",
                points: [
                  "Report dump locations with a photo & GPS coordinates",
                  "Earn 10 Eco-Credits per AI-verified waste report",
                  "Lodge complaints for bin issues or municipal inaction",
                  "List recyclable items for pickup requests",
                  "Track dump status and receive SMS confirmations",
                ],
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: "Municipality Admins",
                color: "border-blue-400",
                points: [
                  "View all reported dumps on a real-time geospatial map",
                  "Assign tasks to the nearest cleaning team via proximity routing",
                  "Monitor district-wide cleanliness metrics and stats",
                  "Manage registered cleaning teams under their district",
                  "Access AI-generated waste classification and severity data",
                ],
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Cleaning Teams",
                color: "border-orange-400",
                points: [
                  "Receive SMS task alerts with address and distance",
                  "View all assigned active tasks on their dashboard",
                  "Upload photographic proof of task completion",
                  "Benefit from proximity-optimized workload distribution",
                  "Get recognition and efficient scheduling through technology",
                ],
              },
            ].map((s) => (
              <div
                key={s.title}
                className={`bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-t-4 ${s.color}`}
              >
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                  {s.icon} {s.title}
                </h3>
                <ul className="space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                      <span className="text-green-500 font-bold mt-0.5">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Model */}
        <section className="bg-emerald-200 dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-2 text-center text-green-500 flex justify-center items-center gap-2">
            <DollarSign className="w-7 h-7" /> Revenue Model
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm">
            Eco-Pulse operates on a multi-stream revenue model where every stakeholder benefits economically.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Stream 1 */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <Coins className="w-5 h-5" /> Platform Service Charges (SaaS)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Municipalities pay a <span className="font-semibold">SaaS subscription fee</span> to
                access the Eco-Pulse dashboard, geospatial tools, AI-verified dump data, and team
                management features. Pricing is scaled per district or city population.
              </p>
              <p className="text-xs text-slate-400 italic">→ Primary B2G (Business-to-Government) revenue stream</p>
            </div>

            {/* Stream 2 */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> AI Waste Data Analytics Licensing
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                The platform accumulates a rich, geospatially tagged, AI-classified waste dataset.
                This anonymized data is licensed to <span className="font-semibold">research institutions,
                environmental NGOs, urban planning bodies, and private sanitation companies</span> as
                paid data intelligence reports.
              </p>
              <p className="text-xs text-slate-400 italic">→ Recurring B2B data licensing revenue</p>
            </div>

            {/* Stream 3 */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl border-l-4 border-orange-500">
              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" /> Recyclable Material Marketplace
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Citizens list large recyclable items (plastic bundles, e-waste, organic waste) on the
                platform. Upcycling industries and recycling centers pay to access and collect these
                materials. <span className="font-semibold">Eco-Pulse earns a transaction commission</span> on
                every successful pickup, while citizens receive direct monetary value for their waste.
              </p>
              <p className="text-xs text-slate-400 italic">→ Marketplace commission model (C2B facilitation)</p>
            </div>

            {/* Stream 4 */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                <HandCoins className="w-5 h-5" /> Upcycling Industry Partnerships
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Recycling and upcycling companies pay for <span className="font-semibold">priority access,
                featured listing, and logistics partnerships</span> within the platform. Municipalities
                benefit by reducing hauling costs through direct diversion of sorted waste to industry —
                and Eco-Pulse earns a partnership fee for orchestrating this supply chain.
              </p>
              <p className="text-xs text-slate-400 italic">→ B2B partnership &amp; premium placement fees</p>
            </div>
          </div>

          {/* Revenue Summary Bar */}
          <div className="mt-8 bg-green-50 dark:bg-slate-900 rounded-xl p-5 border border-green-200 dark:border-slate-700">
            <h4 className="font-bold text-center text-slate-700 dark:text-slate-200 mb-4">Who Earns What</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              {[
                { label: "Eco-Pulse Platform", value: "SaaS fees + Data licensing + Commission", color: "text-green-500" },
                { label: "Municipality", value: "Operational cost savings + Upcycling partnership revenue", color: "text-blue-500" },
                { label: "Citizens", value: "10 Eco-Credits per verified dump + Recyclable sale income", color: "text-yellow-500" },
                { label: "Upcycling Industry", value: "Low-cost raw material supply + Guaranteed volume", color: "text-orange-500" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className={`font-bold text-xs ${item.color}`}>{item.label}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why the Future */}
        <section className="text-center pb-4">
          <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-green-400 flex items-center justify-center gap-2">
            <LineChart className="w-7 h-7" /> Why Eco-Pulse is Built for the Future
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { point: "Unprecedented urban waste growth demands AI-powered, real-time monitoring rather than reactive, paper-based systems." },
              { point: "Rising environmental awareness is turning citizens into active participants — Eco-Credits make this sustainable." },
              { point: "Circular economy policies globally are mandating municipalities to adopt tech-driven waste diversion and tracking." },
              { point: "The Haversine routing model eliminates fuel waste and cuts operational costs by dispatching the nearest team every time." },
              { point: "BullMQ + Redis architecture ensures zero dropped notifications even under high load, with automatic retries." },
              { point: "A single scalable codebase can be onboarded city by city — low replication cost, high civic impact." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-emerald-200 dark:bg-slate-800 p-4 rounded-xl flex gap-3 items-start"
              >
                <Star className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300">{item.point}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
