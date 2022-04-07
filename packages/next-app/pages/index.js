import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { Connect } from "../components/Connect";

import { useContract, useProvider, useSigner } from "wagmi";

import contracts from "../contracts/hardhat_contracts.json";
import config from "../config.json";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentGreeter, setCurrentGreeter] = useState("");
  const [newGreeter, setNewGreeter] = useState("");

  const [{ data: signerData }] = useSigner();

  const chainId = Number(config.network.id);
  const network = config.network.name;
  const greeterAddress = contracts[chainId][0].contracts.Greeter.address;
  const greeterABI = contracts[chainId][0].contracts.Greeter.abi;

  const greeterContract = useContract({
    addressOrName: greeterAddress,
    contractInterface: greeterABI,
    signerOrProvider: signerData,
  });

  const fetchData = async () => {
    const greeter = await greeterContract.greet();
    setCurrentGreeter(greeter);
  };

  useEffect(() => {
    if (signerData) {
      fetchData();
    }
  }, [signerData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tx = await greeterContract.setGreeting(newGreeter);
    setNewGreeter("");
    await tx.wait();
    fetchData();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <Connect />
        </div>
        current greeting : {currentGreeter}
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            required
            value={newGreeter}
            onChange={(e) => setNewGreeter(e.target.value)}
          />
          <button type="submit">submit</button>
        </form>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
