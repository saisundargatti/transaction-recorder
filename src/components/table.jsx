const Table = (data) => {
  return (
    <>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Id</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.id}</td>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.running_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
