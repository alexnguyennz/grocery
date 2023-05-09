import { type FormEventHandler } from "react";

import { Button, Paper, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/*** UTILS ***/
import { POST } from "@/src/utils/fetch";

import { type Cart, type User } from "@/src/utils/supabase";

// testing
const CheckoutForm = ({ cart, user }: { cart: Cart[]; user: User }) => {
  /*** STRIPE ***/
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return; // disable form submission until Stripe.js has loaded

    const data = await POST("/api/checkout", { cart, user }); // create the pending order and any order items

    showNotification({
      message: "Creating order",
      color: "green",
      icon: <IconCheck />,
    });

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${origin}/checkout/success/${data.id}`,
      },
    });

    if (error) {
      showNotification({
        title: "Error processing payment",
        message: error.message,
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between gap-5 md:flex-row"
      >
        <div className="space-y-5">
          <Paper shadow="xs" p="md">
            <Stack>
              <small>4242424242424242 with any expiration/CVC</small>

              <PaymentElement />
            </Stack>
          </Paper>

          <Paper shadow="xs" p="md">
            <Button type="submit" color="dark.8" fullWidth>
              Create order
            </Button>
          </Paper>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
