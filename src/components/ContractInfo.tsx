import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { contract } from '../utils/contract';
import { formatNumber, secondsToDays, formatAddress } from '../utils/format';

export default function ContractInfo() {
  const [contractBalance, setContractBalance] = useState('0');
  const [totalPlstr, setTotalPlstr] = useState('0');
  const [backingRatio, setBackingRatio] = useState('0');
  const [issuanceDays, setIssuanceDays] = useState('0');

  const fetchData = async () => {
    try {
      const [balance, period] = await contract.getContractInfo();
      const total = await contract.totalSupply();
      const ratio = await contract.getVPLSBackingRatio();
      setContractBalance(ethers.formatEther(balance));
      setTotalPlstr(ethers.formatEther(total));
      setBackingRatio(ethers.formatEther(ratio));
      setIssuanceDays(secondsToDays(Number(period)));
    } catch (error) {
      console.error('Error fetching contract info:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 glass"
    >
      <h2 className="text-xl font-bold mb-4">Contract Info</h2>
      <p>vPLS in Contract: {formatNumber(contractBalance)} vPLS</p>
      <p>PLSTR Issued: {formatNumber(totalPlstr)} PLSTR</p>
      <p>Backing Ratio: {formatNumber(backingRatio)} vPLS per PLSTR</p>
      <p>Issuance Period: {issuanceDays} remaining</p>
      <p>
        PLSTR Address:{' '}
        <a
          href="https://etherscan.io/address/0x6c1dA678A1B615f673208e74AB3510c22117090e"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 truncate-address"
        >
          {formatAddress('0x6c1dA678A1B615f673208e74AB3510c22117090e')}
        </a>
      </p>
      <p>
        vPLS Address:{' '}
        <a
          href="https://etherscan.io/token/0x0181e249c507d3b454de2444444f0bf5dbe72d09"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 truncate-address"
        >
          {formatAddress('0x0181e249c507d3b454de2444444f0bf5dbe72d09')}
        </a>
      </p>
    </motion.div>
  );
}
