import React, { useState } from 'react';

const ReportDumpForm = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !location || !description || !contactInfo) {
      alert('Please fill in all fields.');
      return;
    }

    const formData = {
      name,
      location,
      description,
      contactInfo,
      timeReported: new Date().toISOString(),
    };

    const response = await fetch('http://your-backend-url/api/report-dump', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      alert('Dump report submitted successfully!');
      setName('');
      setLocation('');
      setDescription('');
      setContactInfo('');
    } else {
      alert('Error submitting dump report.');
    }
  };

  return (
    <div
      style={{
        padding: '30px',
        width: '380px',
        marginTop: '100px', // Adjusted to be lower
        marginLeft: '260px', // Adjusted for better positioning from sidebar
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2
        style={{
          fontSize: '28px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#333',
        }}
      >
        Report a Dump
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Name Input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              fontSize: '14px',
              color: '#555',
              marginBottom: '5px',
              display: 'block',
              fontWeight: '500',
            }}
          >
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxSizing: 'border-box',
              transition: 'border 0.3s ease-in-out',
            }}
          />
        </div>

        {/* Location Input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              fontSize: '14px',
              color: '#555',
              marginBottom: '5px',
              display: 'block',
              fontWeight: '500',
            }}
          >
            Location (Lat, Long)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter Latitude and Longitude"
            required
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxSizing: 'border-box',
              transition: 'border 0.3s ease-in-out',
            }}
          />
        </div>

        {/* Description Input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              fontSize: '14px',
              color: '#555',
              marginBottom: '5px',
              display: 'block',
              fontWeight: '500',
            }}
          >
            Description of the Dump
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the dump"
            required
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxSizing: 'border-box',
              resize: 'vertical',
              minHeight: '80px',
              transition: 'border 0.3s ease-in-out',
            }}
          />
        </div>

        {/* Contact Info Input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              fontSize: '14px',
              color: '#555',
              marginBottom: '5px',
              display: 'block',
              fontWeight: '500',
            }}
          >
            Contact Email or Phone
          </label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Email or Phone Number"
            required
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxSizing: 'border-box',
              transition: 'border 0.3s ease-in-out',
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: '14px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportDumpForm;
