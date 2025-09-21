import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const RegisterRecycle = () => {
  const [recycableItems, setRecycableItems] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const token = localStorage.getItem("accessToken");
  const dataCardRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const notifyError = () => toast.error("Error Registering Recycle Item");
  const notifySuccess = () =>
    toast.success("Recycle Item Registered Successfully");

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)},${longitude.toFixed(6)}`);
        },
        (error) => {
          alert("Unable to retrieve location. Please allow location access.");
          console.error(error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const [lat, lng] = location.split(",").map(Number);

    const formData = new FormData();
    formData.append("recycableItems", recycableItems);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("address", address);
    formData.append("location[type]", "Point");
    formData.append("location[coordinates][]", lng);
    formData.append("location[coordinates][]", lat);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/recycle/create-recycle`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        setRecycableItems("");
        setDescription("");
        setQuantity("");
        setAddress("");
        setLocation("");
        setImage(null);
        setData(res.data.data);
        notifySuccess();
        dataCardRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.log(error);
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen pt-18 pb-10 dark:bg-slate-900">
      <ToastContainer />
      <div className="max-w-md w-full p-5 bg-white dark:bg-green-900 dark:text-white rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Register Recycle Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={recycableItems}
            onChange={(e) => setRecycableItems(e.target.value)}
            className="w-full border p-2 rounded focus:border-green-500 outline-none"
            placeholder="Recyclable Items"
            required
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded focus:border-green-500 outline-none"
            placeholder="Quantity"
            required
            min={1}
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded focus:border-green-500 outline-none"
            placeholder="Latitude,Longitude"
            required
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm w-full"
          >
            Use GPS
          </button>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full h-10 border p-2 rounded focus:border-green-500 outline-none"
            placeholder="Address"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded focus:border-green-500 outline-none"
            rows={3}
            placeholder="Description"
            required
          />
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full border-2 border-gray-400 rounded p-2 hover:bg-blue-100 dark:hover:bg-blue-900"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Register Recycle"}
          </button>
        </form>
      </div>

      {data && (
        <div
          ref={dataCardRef}
          className="mt-10 max-w-md bg-white dark:bg-blue-950 dark:text-white rounded-xl shadow-lg p-4 space-y-4"
        >
          <h3 className="text-xl font-bold">Submitted Recycle Info</h3>
          <p>
            <span className="font-semibold">Item:</span> {data.recycableItems}
          </p>
          <p>
            <span className="font-semibold">Quantity:</span> {data.quantity}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {data.description}
          </p>
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {data.location?.coordinates?.[1]}, {data.location?.coordinates?.[0]}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {data.address}
          </p>
          {data.image && (
            <img
              src={data.image}
              alt="Recycle Item"
              className="rounded-lg mt-2 w-full h-48 object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterRecycle;
