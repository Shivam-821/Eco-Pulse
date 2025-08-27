import React, { useEffect, useState } from "react";
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
      console.log("hi")
      console.log(res.data.data)
      setRecycles(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching recycle items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecycles();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen py-10 dark:bg-slate-900">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-10 mt-6 dark:text-white">
        All Recycle Items
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {recycles.map((item) => (
          <div
            key={item._id}
            className="w-full max-w-md bg-white dark:bg-blue-950 dark:text-white rounded-xl shadow-lg overflow-hidden p-4 flex items-center space-x-4"
          >
            {item.image && (
              <img
                src={item.image}
                alt="Recycle"
                className="w-32 h-32 object-contain rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="mt-1 text-md">
                <span className="font-semibold">Recycler:</span> {item.user.fullname}
              </p>
              <h5 className="text-lg font-semibold">{item.recycableItems}</h5>
              <p className="mt-1 text-sm">
                <span className="font-semibold">Quantity:</span> {item.quantity}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-semibold">Address:</span> {item.address}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-semibold">Status:</span> {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllRecycle;
