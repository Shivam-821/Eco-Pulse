import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  
} from "@heroicons/react/24/outline";
import { IoTrashBin } from "react-icons/io5";

const StatsDashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/stats/get-details`
        );
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const dumpData = [
    { name: "Completed", value: stats.dumps.completed },
    { name: "Pending", value: stats.dumps.pending },
    { name: "Complaints", value: stats.dumps.complainLodge },
  ];

  const recycleData = [
    { name: "Collected", value: stats.recycle.collected },
    { name: "Pending", value: stats.recycle.pending },
  ];

  const dumpTrendData = [
    { day: "Mon", dumps: 12 },
    { day: "Tue", dumps: 19 },
    { day: "Wed", dumps: 14 },
    { day: "Thu", dumps: 22 },
    { day: "Fri", dumps: 18 },
    { day: "Sat", dumps: 15 },
    { day: "Sun", dumps: 10 },
  ];

  const topUsersData = stats.topUsers.map((user, index) => ({
    id: user._id,
    name: user.fullname,
    dumps: user.dumpCount,
    avatar: user.avatar,
    rank: index + 1,
    score: user.dumpCount * 10,
  }));

  const performanceData = [
    { subject: "Completion", A: stats.dumps.completionRate, fullMark: 100 },
    { subject: "Recycling", A: stats.recycle.successRate, fullMark: 100 },
    { subject: "Efficiency", A: 78, fullMark: 100 },
    { subject: "User Engagement", A: 85, fullMark: 100 },
    { subject: "Satisfaction", A: 70, fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg shadow-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {label}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {payload[0].name}:{" "}
            <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#34D399", "#FBBF24", "#F87171"];

  return (
    <div className="pt-10 dark:bg-slate-900 min-h-screen px-6 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto py-12 flex flex-col gap-17">
        <section className="text-center dark:bg-slate-800 bg-emerald-200 rounded-md py-18 px-4">
          <h1 className="text-5xl font-bold mb-6 text-green-500">
            Eco Dashboard
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
            Monitor waste management statistics and user contributions
          </p>
        </section>

        <section id="stats-summary">
          <h2 className="text-4xl font-bold text-center mb-14 text-blue-700 dark:text-green-400">
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-center">
              <IoTrashBin className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Total Smart Bins
              </h3>
              <p className="text-4xl font-bold text-green-500">
                {stats.smartBins.total}
              </p>
            </div>

            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-center">
              <CheckCircleIcon className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-green-700">
                Dump Completion
              </h3>
              <p className="text-4xl font-bold text-green-500">
                {stats.dumps.completionRate}%
              </p>
            </div>

            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-center">
              <ArrowPathIcon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Recycle Success
              </h3>
              <p className="text-4xl font-bold text-green-500">
                {stats.recycle.successRate}%
              </p>
            </div>

            <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-center">
              <ExclamationCircleIcon className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-red-700">
                Complaints
              </h3>
              <p className="text-4xl font-bold text-green-500">
                {stats.dumps.complainLodge}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-green-400">
              Dump Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dumpData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  className="dark:stroke-gray-400"
                />
                <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dumpData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-emerald-200 dark:bg-slate-800 p-4 py-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-green-400">
              Recycle Status
            </h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={recycleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}:\n ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {recycleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % 2]}
                        stroke="#FFFFFF"
                        className="dark:stroke-slate-800"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-green-400">
              Top Contributors
            </h2>
            <div className="space-y-4">
              {topUsersData.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-emerald-100 dark:bg-slate-700 hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-amber-700"
                          : "bg-blue-500"
                      }`}
                    >
                      <span className="text-white font-bold">{user.rank}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.dumps} dumps registered
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {user.score} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-green-500">
              Performance Metrics
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={performanceData}
              >
                <PolarGrid stroke="#E5E7EB" className="stroke-1 stroke-white dark:stroke-black" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                  className=""
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#E5E7EB"
                  className="stroke-blue-800 dark:stroke-amber-200"
                />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke="#34D399"
                  fill="#34D399"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(255, 255, 255)",
                    borderColor: "rgb(229, 231, 235)",
                    color: "rgb(31, 41, 105)",
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-green-400">
            Weekly Dump Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={dumpTrendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDumps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                stroke="#6B7280"
                className="dark:stroke-gray-400"
              />
              <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                className="dark:stroke-gray-700"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="dumps"
                stroke="#34D399"
                fillOpacity={1}
                fill="url(#colorDumps)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
};

export default StatsDashboardPage;
