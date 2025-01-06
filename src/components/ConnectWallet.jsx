import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './ConnectWallet.css';

const ConnectWallet = ({ applyDiscount }) => {
    const [account, setAccount] = useState(null);
    const [ethBalance, setEthBalance] = useState(0);
    const [tokenBalances, setTokenBalances] = useState([]);
    const [holderRanks, setHolderRanks] = useState([]);
    const [network, setNetwork] = useState('');
    const [loading, setLoading] = useState(false);

    const web3 = new Web3(window.ethereum);

    // Example ERC-20 token contract addresses (replace as needed)
    const tokenContracts = [
        { name: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
        { name: 'POL', address: '0xC28e931814725BbEB9e670676FaBBCb694Fe7DF2', decimals: 18 },
        { name: 'LSS', address: '0x3b9be07d622accaed78f479bc0edabfd6397e320', decimals: 18 },
    ];

    /**
     * Calculate an approximate "top percentage" by:
     * 1. Fetching totalSupply (returned as a BigInt string)
     * 2. Converting totalSupply to float, factoring in decimals
     * 3. Dividing userBalance by totalSupply (both in float)
     */
    const fetchTopPercentage = async (token, userBalance) => {
        if (!token.address) {
            console.error(`Error: Contract address not specified for ${token.name}`);
            return { name: token.name, percentage: 'N/A' };
        }

        try {
            const tokenContract = new web3.eth.Contract(
                [
                    {
                        constant: true,
                        inputs: [],
                        name: 'totalSupply',
                        outputs: [{ name: 'supply', type: 'uint256' }],
                        type: 'function',
                    },
                ],
                token.address
            );

            // totalSupply will come back as a string representing a big integer
            const totalSupplyStr = await tokenContract.methods.totalSupply().call();
            console.log(`${token.name} Total Supply:`, totalSupplyStr);

            // Convert totalSupply to a BigInt
            const totalSupplyBigInt = BigInt(totalSupplyStr);

            // Convert BigInt total supply to a floating-point number by factoring in decimals
            //   e.g. totalSupply = totalSupplyBigInt / 10^decimals
            const totalSupplyFloat = parseFloat(
                (totalSupplyBigInt / BigInt(10 ** token.decimals)).toString()
            );

            // userBalance is already a float (from Number(adjustedBalance))
            // Example: 3544 for LSS in your logs
            // Now do the ratio in float
            const ratio = userBalance / totalSupplyFloat; // e.g. 3544 / (some large total supply)
            const userPercentage = ratio * 100;           // convert to %

            return {
                name: token.name,
                percentage: userPercentage.toFixed(2),
            };
        } catch (err) {
            console.error(`Error fetching total supply for ${token.name}:`, err);
            return { name: token.name, percentage: 'N/A' };
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                setLoading(true);

                // Request accounts from MetaMask
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });

                if (!accounts || accounts.length === 0) {
                    alert('No accounts found. Please connect a wallet.');
                    return;
                }

                const selectedAccount = accounts[0];
                setAccount(selectedAccount);

                // Fetch ETH balance
                const balance = await web3.eth.getBalance(selectedAccount);
                const ethBalanceInEther = parseFloat(web3.utils.fromWei(balance, 'ether'));

                applyDiscount(ethBalanceInEther > 0);
                setEthBalance(ethBalanceInEther);

                // Fetch token balances
                const fetchedTokenBalances = await Promise.all(
                    tokenContracts.map(async (token) => {
                        try {
                            const tokenContract = new web3.eth.Contract(
                                [
                                    {
                                        constant: true,
                                        inputs: [{ name: '_owner', type: 'address' }],
                                        name: 'balanceOf',
                                        outputs: [{ name: 'balance', type: 'uint256' }],
                                        type: 'function',
                                    },
                                ],
                                token.address
                            );

                            // raw balance as a BigInt string (e.g. "3544563...")
                            const rawBalanceStr = await tokenContract.methods
                                .balanceOf(selectedAccount)
                                .call();

                            console.log(`${token.name} raw balance:`, rawBalanceStr);

                            // Convert raw balance to BigInt and then to float
                            const adjustedBalanceBigInt = BigInt(rawBalanceStr);
                            const adjustedBalanceFloat = parseFloat(
                                (adjustedBalanceBigInt / BigInt(10 ** token.decimals)).toString()
                            );

                            console.log(`${token.name} adjusted balance:`, adjustedBalanceFloat);

                            // Return an object that also includes address/decimals
                            return {
                                name: token.name,
                                address: token.address,
                                decimals: token.decimals,
                                balance: adjustedBalanceFloat,
                            };
                        } catch (err) {
                            console.error(`Error fetching balance for ${token.name}:`, err);
                            return {
                                name: token.name,
                                address: token.address,
                                decimals: token.decimals,
                                balance: 0,
                            };
                        }
                    })
                );

                // Update local state with token balances
                setTokenBalances(fetchedTokenBalances);

                // For each token, compute the approximate "top percentage"
                const holderRanks = await Promise.all(
                    fetchedTokenBalances.map(async (token) => {
                        return fetchTopPercentage(token, token.balance);
                    })
                );

                console.log('Holder Ranks:', holderRanks);
                setHolderRanks(holderRanks);

                // Fetch network name
                const chainId = await web3.eth.getChainId();
                console.log('Fetched chainId:', chainId);

                const networkName = getNetworkName(chainId);
                console.log('Network name:', networkName);

                setNetwork(networkName);
            } catch (error) {
                console.error('Error connecting wallet or fetching data:', error);

                if (error.code === 4001) {
                    alert('Connection request was rejected.');
                } else {
                    alert('Failed to connect to wallet. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const getNetworkName = (chainId) => {
        const numericChainId = Number(chainId);
        switch (numericChainId) {
            case 1:
                return 'Ethereum Mainnet';
            case 3:
                return 'Ropsten Testnet';
            case 4:
                return 'Rinkeby Testnet';
            case 5:
                return 'Goerli Testnet';
            case 42:
                return 'Kovan Testnet';
            default:
                return 'Unknown Network';
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    connectWallet();
                } else {
                    setAccount(null);
                    setEthBalance(0);
                    setTokenBalances([]);
                    setHolderRanks([]);
                    applyDiscount(false);
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, [applyDiscount]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : account ? (
                <div className="wallet-info">
                    <p>
                        <span>Connected Account:</span> {account}
                    </p>
                    <p className="eth-balance">{ethBalance.toFixed(4)} ETH</p>
                    <p>
                        <span>Network:</span> {network}
                    </p>
                    <h3>Token Balances:</h3>
                    <ul>
                        {tokenBalances.map((token) => (
                            <li key={token.name}>
                                {token.name}: {token.balance.toFixed(4)}
                            </li>
                        ))}
                    </ul>
                    <h3>Holder Rankings:</h3>
                    <ul>
                        {holderRanks.map((holder) => (
                            <li key={holder.name}>
                                {holder.name}: You are in the top {holder.percentage}% of holders
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <button onClick={connectWallet} className="connect-wallet">
                    Connect Wallet
                </button>
            )}
        </div>
    );
};

export default ConnectWallet;
