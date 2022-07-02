//Have a function to call the lottery
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const dispatch = useNotification();

  const chainId = parseInt(chainIdHex);

  const raffleAdress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAdress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAdress, //specify the networkId
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAdress, //specify the networkId
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAdress, //specify the networkId
    functionName: "getRecentWinner",
    params: {},
  });

  const updateUI = async () => {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = async () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "checkmark",
    });
  };

  return (
    // <div>The raffle</div>
    <div>
      {raffleAdress ? (
        <div>
          <p>The raffle</p>
          <button
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
              });
            }}
          >
            Enter Raffle
          </button>
          <p>Entrance Fee: {ethers.utils.formatUnits(entranceFee)}ETH</p>
          <p>Number Of Players: {numPlayers}</p> <p>Recent Winner: {recentWinner}</p>{" "}
        </div>
      ) : (
        <p>No Raffle Address Detected</p>
      )}
    </div>
  );
};

export default LotteryEntrance;
