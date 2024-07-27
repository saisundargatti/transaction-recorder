import { useState } from "react";
import "./post.css";

const Update = () => {
  const [id, setId] = useState(""); // Add state for the transaction ID
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setError("Transaction ID is required.");
      return;
    }

    const updatedTransaction = {
      type,
      amount,
      description,
      date,
    };

    try {
      const response = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      const data = await response.json();
      console.log("Transaction updated successfully:", data);
      setAmount("");
      setType("Expense");
      setDescription("");
      setDate("");
      setId(""); // Clear the ID field
      setError(null);
      setSuccess("Transaction updated successfully!");
    } catch (error) {
      console.error("Error updating transaction:", error);
      setError(error.message); // Set the error message for display
      setSuccess(null);
    }
  };

  return (
    <div className="form-container">
      <h2>Update Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">Transaction ID</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Update Transaction
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default Update;
