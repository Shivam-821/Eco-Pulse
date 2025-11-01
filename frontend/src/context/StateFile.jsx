import { useEffect, useState } from "react"; 

function StateDistrictSelector() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/list.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading states and districts...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  // You can now process 'data' to populate your dropdowns
  return (
    <div>
      {/* Example: listing the first state name */}
      <h1>Data Loaded: {Object.keys(data)[0]}</h1>
      {/* ... your form elements will go here ... */}
    </div>
  );
}

export default StateDistrictSelector;
