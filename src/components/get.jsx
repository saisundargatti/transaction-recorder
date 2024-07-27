/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

const Get = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:3000/transactions";
        const response = await fetch(url);
        const data = await response.json();
        setData(data.transactions);

        let income = 0;
        let expenses = 0;
        data.transactions.forEach((transaction) => {
          if (transaction.type === "Income") {
            income += parseFloat(transaction.amount);
          } else if (transaction.type === "Expense") {
            expenses += parseFloat(transaction.amount);
          }
        });

        setTotalIncome(income);
        setTotalExpenses(expenses);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Id</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.id}</td>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td className="currency">{transaction.amount}</td>
              <td>{transaction.date}</td>
              <td className="currency">{transaction.running_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Get;
