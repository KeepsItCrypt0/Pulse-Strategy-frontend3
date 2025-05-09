import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { contract } from '../utils/contract';
import { formatNumber, formatDate } from '../utils/format';

export default function StrategyControllerInfo() {
  const [mintedPlstr, setMintedPlstr] = useState('0');
  const [depositedVpls, setDepositedVpls] = useState('0');
  const [lastMint, setLastMint] = useState('0');
  const [lastDeposit, setLastDeposit] = useState('0');

  const fetchControllerData = async () => {
    try {
      const owner = await contract.owner();
      const mintedEvents = await contract.queryFilter(contract.filters.SharesMinted(owner));
      const depositedEvents = await contract.queryFilter(contract.filters.StakedPLSDeposited(owner));
      let totalMinted = ethers.BigNumber.from(0);
      let totalDeposited = ethers.BigNumber.from(0);
      let latestMint = 0;
      let latestDeposit = 0;

      for (const event of mintedEvents) {
        totalMinted = totalMinted.add(event.args.amount);
        latestMint = Math.max(latestMint, Number(event.args.timestamp));
      }
      for (const event of depositedEvents) {
        totalDeposited = totalDeposited.add(event.args.amount);
        latestDeposit = Math.max(latestDeposit, Number(event.args.timestamp));
      }

      // Delay timestamps by 24 hours
      const delayedMint = latestMint ? latestMint - 24 * 3600 : 0;
      const delayedDeposit = latestDeposit ? latestDeposit - 24 * 3600 : 0;

      setMintedPlstr(ethers.formatEther(totalMinted));
      setDepositedVpls(ethers.formatEther(totalDeposited));
      setLastMint(delayedMint.toString());
      setLastDeposit(delayedDeposit.toString());
    } catch (error) {
      console.error('Error fetching controller info:', error);
    }
  };

  useEffect(() => {
    fetchControllerData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 glass"
    >
      <h2 className="text-xl font-bold mb-4">Strategy Controller Info</h2>
      <p>PLSTR Minted: {formatNumber(mintedPlstr)} PLSTR</p>
      <p>vPLS Deposited: {formatNumber(depositedVpls)} vPLS</p>
      <p>Last Mint: {lastMint ? formatDate(Number(lastMint)) : 'N/A'}</p>
      <p>Last Deposit: {lastDeposit ? formatDate(Number(lastDeposit)) : 'N/A'}</p>
    </motion.div>
  );
}
