import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { contract } from '../utils/contract';
import { formatNumber, formatDate, formatAddress } from '../utils/format';

interface Transaction {
  type: string;
  amount: string;
  timestamp: string;
  txHash: string;
}

export default function TransactionHistory({ account }: { account: string | null }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    if (!account) return;
    try {
      const filterIssued = contract.filters.SharesIssued(account);
      const filterRedeemed = contract.filters.SharesRedeemed(account);
      const issuedEvents = await contract.queryFilter(filterIssued);
      const redeemedEvents = await contract.queryFilter(filterRedeemed);

      const txs: Transaction[] = [];
      for (const event of issuedEvents) {
        txs.push({
          type: 'Issued PLSTR',
          amount: formatNumber(event.args.shares),
          timestamp: formatDate((await event.getBlock()).timestamp),
          txHash: event.transactionHash,
        });
      }
      for (const event of redeemedEvents) {
        txs.push({
          type: 'Redeemed PLSTR',
          amount: formatNumber(event.args.shares),
          timestamp: formatDate((await event.getBlock()).timestamp),
          txHash: event.transactionHash,
        });
      }
      txs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setTransactions(txs.slice(0, 5)); // Limit to 5 recent transactions
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [account]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 glass"
    >
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((tx, index) => (
            <li key={index} className="mb-2">
              <p>
                {tx.type}: {tx.amount} {tx.type.includes('Issued') ? 'PLSTR' : 'vPLS'}
              </p>
              <p>
                Date: {tx.timestamp} |{' '}
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 truncate-address"
                >
                  {formatAddress(tx.txHash)}
                </a>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </motion.div>
  );
}
