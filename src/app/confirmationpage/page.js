"use client";
import styles from "../confirmationpage/page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className={styles.success}>
        <div className={styles.successContainer}>
          <h1>Success!</h1>
          <p>Your operation was completed successfully.</p>

          <p>
            Thank you for your submission. We have received it, and our team
            will follow up if necessary.
          </p>

          <Link href="/home">
            <button className={styles.homeButton}>Go to Home</button>
          </Link>
        </div>
      </div>
    </>
  );
}
