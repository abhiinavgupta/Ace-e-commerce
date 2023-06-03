import styles from "../../styles/forgot.module.scss";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { BiLeftArrowAlt } from "react-icons/bi";
import CircledIconBtn from "../../components/buttons/circledIconBtn";
import LoginInput from "../../components/inputs/loginInput";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import DotLoaderSpinner from "../../components/loaders/dotLoader";
import axios from "axios";
import { getSession } from "next-auth/react";
export default function forgot() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");
  const emailValidation = Yup.object({
    email: Yup.string()
      .required(
        "You'll need this when you log in and if you ever need to reset your password."
      )
      .email("Enter a valid email address."),
  });
  const forgotHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/forgot", {
        email,
      });
      setError("");
      setSuccess(data.message);
      setLoading(false);
      setEmail("");
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
  };
  const country = {
    name: "India",
    flag: "data:image/jpeg;base64,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",
  };
  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header country={country} />
      <div className={styles.forgot}>
        <div>
          <div className={styles.forgot__header}>
            <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div>
            <span>
              Forgot your password ? <Link href="/api/auth/signin">Login instead</Link>
            </span>
          </div>
          <Formik
            enableReinitialize
            initialValues={{
              email,
            }}
            validationSchema={emailValidation}
            onSubmit={() => {
              forgotHandler();
            }}
          >
            {(form) => (
              <Form>
                <LoginInput
                  type="text"
                  name="email"
                  icon="email"
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <CircledIconBtn type="submit" text="Send link" />
                <div style={{ marginTop: "10px" }}>
                  {error && <span className={styles.error}>{error}</span>}
                  {success && <span className={styles.success}>{success}</span>}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer country={country} />
    </>
  );
}