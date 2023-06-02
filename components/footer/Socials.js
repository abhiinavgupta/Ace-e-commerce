import styles from "./styles.module.scss";
import { FaFacebookF, FaTiktok } from "react-icons/fa";
import {
  BsInstagram,
  BsTwitter,
  BsYoutube,
  BsLinkedin,
  BsGithub,
} from "react-icons/bs";
import {CgMail} from "react-icons/cg";
import {AiFillFacebook} from "react-icons/ai";
export default function Socials() {
  return (
    <div className={styles.footer__socials}>
      <section>
        <h3>STAY CONNECTED</h3>
        <ul>
          <li>
            <a href="https://www.facebook.com/abhinav.gupta.7127/" target="_blank">
              <AiFillFacebook />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/abhiiinavgupta/" target="_blank">
              <BsInstagram />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/abhiiinavgupta" target="_blank">
              <BsTwitter />
            </a>
          </li>
          <li>
            <a href="/" target="_blank">
              <BsYoutube />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/abhinav-gupta-a07b93219/" target="_blank">
              <BsLinkedin />
            </a>
          </li>
          <li>
            <a href="https://github.com/abhiinavgupta" target="_blank">
              <BsGithub />
            </a>
          </li>
          <li>
            <a href="gabhinav133@gmail.com" target="_blank">
              <CgMail />
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}