import { getPostDatasFromAxios } from "../../services/axios.service";

const PayButton = ({ cartItems }: any) => {
    const handleCheckout = async () => {
      const resp = await getPostDatasFromAxios("/stripe/create-checkout-session", {cartItems});
      console.log(resp);
      if (resp.success) {
        window.location.href = resp.stripeUrl;
      }
  }
  return (
    <div>
      <button onClick={() => handleCheckout()}>Checkout</button>
    </div>
  )
}

export default PayButton