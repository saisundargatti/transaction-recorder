import { useState } from "react";
import "./post.css"; // Import the CSS file

const Post = () => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTransaction = {
      type,
      amount,
      description,
      date,
    };

    try {
      const response = await fetch(`http://localhost:3000/transactions`, {
        method: "POST",
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
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Post Transaction</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
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
          Post Transaction
        </button>
      </form>
    </div>
  );
};

export default Post;
