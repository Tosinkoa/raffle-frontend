import Head from "next/head";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";
import ManualHeader from "../components/ManualHeader";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Paul raffle smart contract" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {/* <ManualHeader /> */}
        <Header />
        <LotteryEntrance />
      </div>
    </div>
  );
}
