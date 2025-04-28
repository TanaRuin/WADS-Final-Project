import React, { useState } from "react";
import "./TicketForm.css"; // Create this for form-specific styles

const TicketForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    category: "",
    priority: "",
    issue: "",
    description: "",
    attachments: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <h2>Create Ticket</h2>
      <div className="form-row">
        <label>Category*</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Technical">Technical</option>
          <option value="Billing">Billing</option>
          <option value="General">General</option>
        </select>
      </div>
      <div className="form-row">
        <label>Priority*</label>
        <select name="priority" value={form.priority} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="form-row">
        <label>Issue*</label>
        <select name="issue" value={form.issue} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Invalid Link">Invalid Link</option>
          <option value="Login Problem">Login Problem</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-row">
        <label>Attachments*</label>
        <input type="file" name="attachments" onChange={handleChange} />
      </div>
      <div className="form-row">
        <label>Task Description*</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Describe your issue..."
        />
      </div>
      <div className="form-actions">
        <button type="button" className="close-btn">Close</button>
        <button type="submit" className="add-task-btn">Add Task</button>
      </div>
    </form>
  );
};

export default TicketForm;
