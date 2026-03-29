"use client";

import Script from "next/script";

export function StripeButton() {
  return (
    <>
      <Script async src="https://js.stripe.com/v3/buy-button.js" />
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <stripe-buy-button
              buy-button-id="buy_btn_1TGMsaPe5qDnzv2DDA9QSo8q"
              publishable-key="pk_live_51TD51RPe5qDnzv2D0jCRm9Njfv71Jxc07lMedlKLO7iEx831EzKCr7wWxsYIAwAeidkafSaXkUfpWAMSTQ9PeMQK00mabNW0s6"
            ></stripe-buy-button>
          `,
        }}
      />
    </>
  );
}
