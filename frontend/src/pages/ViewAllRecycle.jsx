import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ViewAllRecycle = () => {
  const [recycles, setRecycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecycles = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/recycle/get-all-recycle`
      );
      setRecycles(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching recycle items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecycles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e4feed] dark:bg-gray-900 py-15 px-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <h2 className="text-4xl h-13 mt-1 font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">
            All Recyclable Items
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Discover recyclable materials available in your community. Help
            promote sustainability by reusing and recycling.
          </p>
        </div>
      </div>

      {/* Recycle Items Grid */}
      <div className="max-w-7xl mx-auto">
        {recycles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No Recyclable Items Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to list recyclable materials in your area!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recycles.map((item, index) => (
              <div
                key={item._id}
                className="bg-[#f1fff5] dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Section */}
                {item.image && (
                  <div className="relative h-46 overflow-hidden">
                    <img
                      src={item.image}
                      alt="Recyclable item"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "available"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : item.status === "pending"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {item.status?.charAt(0).toUpperCase() +
                          item.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className="px-5 py-3">
                  {/* Item Title */}
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                    {item.recycableItems}
                  </h3>

                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {item.user?.fullname?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {item.user?.fullname}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recycler
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 py-2 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Quantity
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {item.quantity}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 py-2 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Type
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize">
                        {item.recycableItems?.split(" ")[0].toLowerCase()}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Location
                    </p>
                    <p className="text-sm text-gray-800 dark:text-white line-clamp-2">
                      {item.address}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ViewAllRecycle;
