"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Container } from "react-bootstrap";
import loginImg from "../../public/bg-img.svg";
import imgFrame from "../../public/img_frame.svg";
import Login from "@/components/Login/Login";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Container fluid className={styles.login_space}>
        <div className={styles.align_login}>
          <div className={styles.bg_img_login}>
            <div className={styles.bg_img_login1}>
              <Image
                src={loginImg}
                priority
                className="img-fluid"
                alt="img_logo"
              />
            </div>
            <div className={styles.stunt}>
              <Image
                src={imgFrame}
                priority
                className={`img-fluid`}
                alt="img_logo"
              />
            </div>
          </div>
          <div className={styles.shape_login}>
            <Login />
          </div>
        </div>
      </Container>
    </>
  );
}
