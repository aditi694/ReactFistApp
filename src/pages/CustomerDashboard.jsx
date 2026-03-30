import { useEffect, useState } from "react";
import { getCustomerDashboard } from "../api/customerApi";

const CustomerDashboard = () => {

    const [data, setData] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await getCustomerDashboard();
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!data) return <h3>Loading...</h3>;

    return (
        <div>
            <h2>Customer Dashboard</h2>

            <h3>{data.customerName}</h3>

            <p>Account Number: {data.accountNumber}</p>
            <p>Account Type: {data.accountType}</p>
            <p>Balance: ₹{data.balance}</p>

            <h4>Bank Branch</h4>
            <p>{data.bankBranch.bankName}</p>
            <p>{data.bankBranch.branchName}</p>
            <p>{data.bankBranch.city}</p>

            <h4>Debit Card</h4>
            <p>{data.debitCard.cardNumber}</p>
            <p>Limit: ₹{data.debitCard.dailyLimit}</p>

            <h4>Credit Card</h4>
            <p>{data.creditCard.cardNumber}</p>
            <p>Available: ₹{data.creditCard.availableCredit}</p>

            <h4>Loans</h4>
            {data.loans.map((loan) => (
                <div key={loan.loanId}>
                    <p>{loan.loanType} - ₹{loan.loanAmount}</p>
                </div>
            ))}

            <h4>Insurances</h4>
            {data.insurances.map((ins) => (
                <div key={ins.policyNumber}>
                    <p>{ins.insuranceType} - ₹{ins.coverageAmount}</p>
                </div>
            ))}

            <h4>Nominee</h4>
            <p>{data.nominee.name} ({data.nominee.relation})</p>

            <h4>KYC</h4>
            <p>{data.kyc.status}</p>

            <h4>Limits</h4>
            <p>Daily: ₹{data.limits.dailyTransactionLimit}</p>
            <p>Per Txn: ₹{data.limits.perTransactionLimit}</p>

        </div>
    );
};

export default CustomerDashboard;