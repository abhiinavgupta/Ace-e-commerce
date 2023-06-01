import Link from "next/link";
import styles from "./styles.module.scss";
import { FcSearch } from "react-icons/fc";
import { HiShoppingCart } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
export default function Main({ searchHandler }) {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.search || "");
  const { cart } = useSelector((state) => ({ ...state }));
  const handleSearch = (e) => {
    e.preventDefault();
    if (router.pathname !== "/browse") {
      if (query.length > 1) {
        router.push(`/browse?search=${query}`);
      }
    } else {
      searchHandler(query);
    }
  };
  return (
    <div className={styles.main}>
      <div className={styles.main__container}>
        <Link href="/" legacyBehavior>
          <a className={styles.logo}>
            <img src="../../../ace-low-resolution-logo-color-on-transparent-background.png" alt="" />
          </a>
        </Link>
        <form onSubmit={(e) => handleSearch(e)} className={styles.search}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className={styles.search__icon}>
            <FcSearch />
          </button>
        </form>
        <Link href="/cart" legacyBehavior>
          <a className={styles.cart}>
            <HiShoppingCart />
            <span>0</span>
          </a>
        </Link>
      </div>
    </div>
  );
}