import { useState } from "react";

import { Link } from "react-router-dom";
import useAxios from "../../Hook/useAxios";

const TopupLedger = () => {
  const [creditList, setCreditList] = useState([]);
  const [debitList, setDebitList] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  // const fetchTopups = async () => {
  //   const res = await axios.get("http://localhost:5000/api/topups");

  //   const credits = res.data.filter((t) => t.type === "credit");
  //   const debits = res.data.filter((t) => t.type === "debit");

  //   setCreditList(credits);
  //   setDebitList(debits);
  // };

  // useEffect(() => {
  //   fetchTopups();
  // }, []);

  axios.get("topups").then((response) => {
    const credits = response.data.filter((t) => t.type === "credit");
    const debits = response.data.filter((t) => t.type === "debit");
    setCreditList(credits);
    setDebitList(debits);
    setLoading(false);
  }
  );


  const totalCredit = creditList.reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = debitList.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalCredit - totalDebit;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-xl text-3xl"></span>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 bg-white rounded border ">
      <div className="text-right">
        <Link to={"/flynas/add-topup"} className="btn btn-sm bg-[#00b7ac] text-white hover:bg-neutral no-print">
          Add Topup
        </Link>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="border-b pt-4 flex justify-between font-semibold text-lg">
        <span>
          Total Credit: <span className="text-green-700">{totalCredit}</span>
        </span>
        <span>
          Total Debit: <span className="text-red-600">{totalDebit}</span>
        </span>
        <span>
          Balance: <span className="text-blue-700">{balance}</span>
        </span>
      </div>

      <section className="h-[70vh] overflow-y-auto pr-2">
        {/* ================= CREDIT ================= */}
        <div>
          <h2 className="text-green-700 font-semibold mb-2 text-lg">
            Credit Ledger
          </h2>

          <table className="w-full text-sm border text-center">
            <thead className="bg-green-100">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {creditList.map((c, i) => (
                <tr key={i}>
                  <td className="border p-2">{c.date}</td>
                  <td className="border p-2">{c.time}</td>
                  <td className="border p-2 text-green-700 font-semibold">
                    {c.amount}
                  </td>
                  <td className="border p-2">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= DEBIT ================= */}
        <div>
          <h2 className="text-red-700 font-semibold mb-2 text-lg">
            Debit Ledger
          </h2>

          <table className="w-full text-sm border text-center">
            <thead className="bg-red-100">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">PNR</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {debitList.map((d, i) => (
                <tr key={i}>
                  <td className="border p-2">{d.date}</td>
                  <td className="border p-2">{d.time}</td>
                  <td className="border p-2 text-red-600 font-semibold">
                    {d.amount}
                  </td>
                  <td className="border p-2">{d.pnr}</td>
                  <td className="border p-2">{d.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TopupLedger;
