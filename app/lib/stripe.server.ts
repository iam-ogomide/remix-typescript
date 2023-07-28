import Stripe from "stripe";
import { ProductId } from "./interface";


// This fuction is used to get the domain URL
export function getDomainUrl(request: Request) {
    // X-Forward-Host is a cdn thing
  const host =
    request.headers.get("X-Forward-Host") ?? request.headers.get("host");

    // if we dont get the host, throw this error
  if (!host) {
    throw new Error("Could not find the url");
  }

  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}



// Function for the stripe session
export const getStripeSession = async (
  items: string,
  domainUrl: string
): Promise<string> => {
    // initialize stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
    typescript: true,
  });

  //get our items and convert them from string to object
  const dataObj = JSON.parse(items);

  //mapping over the data objects and getting the products
  const lineItems = dataObj.map((product: ProductId) => {
    return {
      price: product.stripeProductId,
      quantity: product.quantity,
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 10,
      },
    };
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,

    // domain url if the payment is successful
    success_url: `${domainUrl}/payment/success`,

    // domain url if the payment is cancelled
    cancel_url: `${domainUrl}/payment/cancelled`,
  });

  return session.url as string;
};