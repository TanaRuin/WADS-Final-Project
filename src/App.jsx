import React from 'react';
import Sidebar from './components/Sidebar'; // Make sure the path is correct
import TicketForm from './components/TicketForm'; // Make sure the path is correct
import './App.css'; // We'll need this for layout styles

function App() {
  const handleTicketSubmit = (formData) => {
    console.log("Submitting Ticket:", formData);
    // --- Placeholder for sending data to your backend ---
    // You'll replace this alert with a fetch() call later
    alert('Ticket submitted! (Backend integration needed)');
    // --- ---

    // You might want to clear the form after submission,
    // but we'll leave that for later.
  };

  return (
    // Basic layout container
    <div className="app-container"> {/* Use a class for styling */}
      <Sidebar />
      <main className="main-content"> {/* Use a class for styling */}
        {/* You might add a header or other elements here later */}
        <TicketForm onSubmit={handleTicketSubmit} />
      </main>
    </div>
  );
}

export default App;