import { useState, useEffect } from "react";

const Delete = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions");
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions");
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      const data = await response.json();
      console.log("Transaction deleted successfully:", data);
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError(error.message); // Set the error message for display
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            style={{
              cursor: "pointer",
              backgroundColor: selectedIds.includes(transaction.id)
                ? "lightgrey"
                : "white",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "lightblue")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = selectedIds.includes(
                transaction.id
              )
                ? "lightgrey"
                : "white")
            }
            onClick={() => handleSelect(transaction.id)}
          >
            {transaction.id}: {transaction.description}
          </li>
        ))}
      </ul>
      <button onClick={() => selectedIds.forEach(handleDelete)}>
        Remove Selected
      </button>
    </div>
  );
};

export default Delete;
