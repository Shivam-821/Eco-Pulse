import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/dump/getall-dump`
        );

        const extractedTeams = response.data.data.map((dump) => ({
          teamname: dump.assignedTeam?.teamname || "Not Assigned",
          phone: dump.assignedTeam?.phone || "N/A",
          location: dump.address || "N/A",
          status: dump.teamAssigned ? "ASSIGNED" : "NOT ASSIGNED",
          dateAssigned: dump.updatedAt || dump.createdAt,
          reported: dump.complainLodge,
        }));

        setTeams(extractedTeams);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching teams:", error);
        setLoading(false)
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) => {
    const matchStatus = statusFilter === "ALL" || team.status === statusFilter;
    const matchSearch = team.teamname
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getChipClass = (status, reported) => {
    if (reported) {
      return "bg-red-500 text-white";
    }
    return status === "ASSIGNED"
      ? "bg-green-500 text-white"
      : "bg-gray-500 text-white dark:bg-slate-700";
  };

  const getButtonClass = (value) =>
    `px-4 py-2 text-sm font-medium border first:rounded-l-lg last:rounded-r-lg focus:outline-none transition-colors duration-200 
    ${
      value === statusFilter
        ? "bg-blue-500 text-white dark:bg-emerald-500"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
    }`;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex ml-1.5 mt-10 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200">
      <div className="flex-grow p-3">
        {/* Filter and Search Section */}
        <div className="flex justify-between mb-4 p-2">
          <div className="inline-flex rounded-lg border dark:border-slate-600">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`${getButtonClass("ALL")}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("ASSIGNED")}
              className={`${getButtonClass("ASSIGNED")}`}
            >
              Assigned
            </button>
            <button
              onClick={() => setStatusFilter("NOT ASSIGNED")}
              className={`${getButtonClass("NOT ASSIGNED")}`}
            >
              Not Assigned
            </button>
          </div>

          <div className="relative">
            <label htmlFor="search-teams" className="sr-only">
              Search Teams
            </label>
            <input
              id="search-teams"
              type="text"
              placeholder="Search Teams"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-4 pr-10 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="shadow-md rounded-lg overflow-hidden dark:bg-slate-800">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Team Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Date Assigned
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredTeams.map((team, index) => (
                <tr
                  key={index}
                  className={`transition-colors duration-200 ${
                    team.reported
                      ? "bg-red-100 dark:bg-red-900/50"
                      : "bg-white dark:bg-slate-800"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {team.teamname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{team.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {typeof team.location === "object"
                      ? `${team.location.coordinates?.join(", ") || "N/A"}`
                      : team.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${getChipClass(
                        team.status,
                        team.reported
                      )}`}
                    >
                      {team.reported ? "Reported" : team.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {team.dateAssigned
                      ? new Date(team.dateAssigned).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
