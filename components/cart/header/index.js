import styles from "./styles.module.scss";
import Link from "next/link";
import { MdPlayArrow } from "react-icons/md";
export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__left}>
          <Link href="/">
            <img src="../../../DC55F90B-C5FA-4363-BCCB-84C9441164B6.jpeg" alt="" />
          </Link>
        </div>
        <div className={styles.header__right}>
          <Link href="/browse" legacyBehavior>
            <a>
              Continue Shopping
              <MdPlayArrow />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

