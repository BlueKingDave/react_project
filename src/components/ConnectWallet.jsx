import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './ConnectWallet.css';

const ConnectWallet = ({ applyDiscount }) => {
    const [account, setAccount] = useState(null);
    const [ethBalance, setEthBalance] = useState(0);
    const [tokenBalances, setTokenBalances] = useState([]);
    const [network, setNetwork] = useState('');
    const [loading, setLoading] = useState(false);

    const web3 = new Web3(window.ethereum);

    // Example ERC-20 token contract addresses (you can replace these)
    const tokenContracts = [
        { name: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
        { name: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
    ];

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                setLoading(true); // Start loading

                // Request accounts from MetaMask
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                const selectedAccount = accounts[0];
                setAccount(selectedAccount);

                // Fetch ETH balance
                const balance = await web3.eth.getBalance(selectedAccount);
                const ethBalanceInEther = parseFloat(
                    web3.utils.fromWei(balance, 'ether')
                );
                setEthBalance(ethBalanceInEther);

                // Fetch token balances
                const fetchedTokenBalances = await Promise.all(
                    tokenContracts.map(async (token) => {
                        const tokenContract = new web3.eth.Contract(
                            [
                                {
                                    constant: true,
                                    inputs: [{ name: '_owner', type: 'address' }],
                                    name: 'balanceOf',
                                    outputs: [{ name: 'balance', type: 'uint256' }],
                                    type: 'function',
                                },
                                {
                                    constant: true,
                                    inputs: [],
                                    name: 'decimals',
                                    outputs: [{ name: '', type: 'uint8' }],
                                    type: 'function',
                                },
                            ],
                            token.address
                        );

                        const balance = await tokenContract.methods
                            .balanceOf(selectedAccount)
                            .call();
                        return {
                            name: token.name,
                            balance: balance / 10 ** token.decimals,
                        };
                    })
                );
                setTokenBalances(fetchedTokenBalances);

                // Fetch network name
                const chainId = await web3.eth.getChainId();
                const networkName = getNetworkName(chainId);
                setNetwork(networkName);

                // Apply discount if ETH balance > 0
                applyDiscount(ethBalanceInEther > 0);
            } catch (error) {
                console.error('Error connecting wallet or fetching data:', error);
                alert('Failed to connect to wallet. Please try again.');
            } finally {
                setLoading(false); // Stop loading
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const getNetworkName = (chainId) => {
        switch (chainId) {
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
