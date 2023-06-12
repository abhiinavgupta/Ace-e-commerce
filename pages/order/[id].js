import styles from "../../styles/order.module.scss";
import Header from "../../components/header";
import Order from "../../models/Order";
import User from "../../models/User";
import { IoIosArrowForward } from "react-icons/io";
import db from "../../utils/db";
import { PayPalButtons, usePayPalScriptReducer ,  PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useReducer, useEffect } from "react";
import axios from "axios";
import StripePayment from "../../components/stripePayment";
import { getSession } from "next-auth/react";

const country = {
  name: "India",
  flag: "data:image/jpeg;base64,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",
};

function reducer(state, action) {
  switch (action.type) {
    case "PAY_REQUEST":
      return { ...state, loading: true };
    case "PAY_SUCCESS":
      return { ...state, loading: false, success: true };
    case "PAY_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_RESET":
      return { ...state, loading: false, success: false, error: false };
  }
}
export default function order({
  orderData,
  paypal_client_id,
  stripe_public_key,
}) {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    success: "",
  });
  useEffect(() => {
    if (!orderData._id) {
      dispatch({
        type: "PAY_RESET",
      });
    } else {
      paypalDispatch({
        type: "resetOptions",
        value: {
          "client-id": paypal_client_id,
          currency: "USD",
        },
      });
      paypalDispatch({
        type: "setLoadingStatus",
        value: "pending",
      });
    }
  }, [order]);

  function createOrderHanlder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: orderData.total,
            },
          },
        ],
      })
      .then((order_id) => {
        return order_id;
      });
  }
  function onApproveHandler(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/order/${orderData._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "PAY_ERROR", payload: error });
      }
    });
  }
  function onErroHandler(error) {
    console.log(error);
  }
  return (
    <>
      <Header country={country} />
      <div className={styles.order}>
        <div className={styles.container}>
          <div className={styles.order__infos}>
            <div className={styles.order__header}>
              <div className={styles.order__header_head}>
                Home <IoIosArrowForward /> Orders <IoIosArrowForward /> ID{" "}
                {orderData._id}
              </div>
              <div className={styles.order__header_status}>
                Payment Status :{" "}
                {orderData.isPaid ? (
                  <img src="../../../images/verified.png" alt="paid" />
                ) : (
                  <img src="../../../images/unverified.png" alt="paid" />
                )}
              </div>
              <div className={styles.order__header_status}>
                Order Status :
                <span
                  className={
                    orderData.status == "Not Processed"
                      ? styles.not_processed
                      : orderData.status == "Processing"
                      ? styles.processing
                      : orderData.status == "Dispatched"
                      ? styles.dispatched
                      : orderData.status == "Cancelled"
                      ? styles.cancelled
                      : orderData.status == "Completed"
                      ? styles.completed
                      : ""
                  }
                >
                  {orderData.status}
                </span>
              </div>
            </div>
            <div className={styles.order__products}>
              {orderData.products.map((product) => (
                <div className={styles.product} key={product._id}>
                  <div className={styles.product__img}>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className={styles.product__infos}>
                    <h1 className={styles.product__infos_name}>
                      {product.name.length > 30
                        ? `${product.name.substring(0, 30)}...`
                        : product.name}
                    </h1>
                    <div className={styles.product__infos_style}>
                      <img src={product.color.image} alt="" /> / {product.size}
                    </div>
                    <div className={styles.product__infos_priceQty}>
                    ₹ {product.price} x {product.qty}
                    </div>
                    <div className={styles.product__infos_total}>
                    ₹ {product.price * product.qty}
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.order__products_total}>
                {orderData.couponApplied ? (
                  <>
                    <div className={styles.order__products_total_sub}>
                      <span>Subtotal</span>
                      <span>₹ {orderData.totalBeforeDiscount}</span>
                    </div>
                    <div className={styles.order__products_total_sub}>
                      <span>
                        Coupon Applied <em>({orderData.couponApplied})</em>{" "}
                      </span>
                      <span>
                        -
                        {(
                          orderData.totalBeforeDiscount - orderData.total
                        ).toFixed(2)}
                        $
                      </span>
                    </div>
                    <div className={styles.order__products_total_sub}>
                      <span>Tax price</span>
                      <span>+ ₹ {orderData.taxPrice}</span>
                    </div>
                    <div
                      className={`${styles.order__products_total_sub} ${styles.bordertop}`}
                    >
                      <span>TOTAL TO PAY</span>
                      <b>₹ {orderData.total}</b>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.order__products_total_sub}>
                      <span>Tax price</span>
                      <span>+ ₹ {orderData.taxPrice}</span>
                    </div>
                    <div
                      className={`${styles.order__products_total_sub} ${styles.bordertop}`}
                    >
                      <span>TOTAL TO PAY</span>
                      <b>₹ {orderData.total}</b>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.order__actions}>
            <div className={styles.order__address}>
              <h1>Customer's Order</h1>
              <div className={styles.order__address_user}>
                <div className={styles.order__address_user_infos}>
                  <img src={orderData.user.image} alt="" />
                  <div>
                    <span>{orderData.user.name}</span>
                    <span>{orderData.user.email}</span>
                  </div>
                </div>
              </div>
              <div className={styles.order__address_shipping}>
                <h2>Shipping Address</h2>
                <span>
                  {orderData.shippingAddress.firstName}{" "}
                  {orderData.shippingAddress.lastName}
                </span>
                <span>{orderData.shippingAddress.address1}</span>
                <span>{orderData.shippingAddress.address2}</span>
                <span>
                  {orderData.shippingAddress.state},
                  {orderData.shippingAddress.city}
                </span>
                <span>{orderData.shippingAddress.zipCode}</span>
                <span>{orderData.shippingAddress.country}</span>
              </div>
              <div className={styles.order__address_shipping}>
                <h2>Billing Address</h2>
                <span>
                  {orderData.shippingAddress.firstName}{" "}
                  {orderData.shippingAddress.lastName}
                </span>
                <span>{orderData.shippingAddress.address1}</span>
                <span>{orderData.shippingAddress.address2}</span>
                <span>
                  {orderData.shippingAddress.state},
                  {orderData.shippingAddress.city}
                </span>
                <span>{orderData.shippingAddress.zipCode}</span>
                <span>{orderData.shippingAddress.country}</span>
              </div>
            </div>
            {!orderData.isPaid && (
              <div className={styles.order__payment}>
                {orderData.paymentMethod == "paypal" && (
                  <div>
                    {isPending ? (
                      <span>loading...</span>
                    ) : (
                      <PayPalButtons
                        createOrder={createOrderHanlder}
                        onApprove={onApproveHandler}
                        onError={onErroHandler}
                      ></PayPalButtons>
                    )}
                  </div>
                )}
                {orderData.paymentMethod == "credit_card" && (
                  <StripePayment
                    total={orderData.total}
                    order_id={orderData._id}
                    stripe_public_key={stripe_public_key}
                  />
                )}
                {orderData.paymentMethod == "cash" && (
                  <div className={styles.cash}>cash</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  db.connectDb();
  const { query } = context;
  const id = query.id;
  const order = await Order.findById(id)
    .populate({ path: "user", model: User })
    .lean();
  let paypal_client_id = process.env.PAYPAL_CLIENT_ID;
  let stripe_public_key = process.env.STRIPE_PUBLIC_KEY;
  // console.log(paypal_client_id);
  db.disconnectDb();
  
  return {
    props: {
      orderData: JSON.parse(JSON.stringify(order)),
      paypal_client_id,
      stripe_public_key,
    },
  };
}
