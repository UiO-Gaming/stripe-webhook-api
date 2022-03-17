require("dotenv").config();
require("stripe")(process.env.STRIPE_SECRET_KEY);
const { default: axios } = require("axios");
const express = require("express");
const app = express();

const webhookUrl = process.env.WEBHOOK_URL;
const port = process.env.PORT;

const sendToDiscord = (message) => {
  const discordPayload = {
    content: message,
  };
  axios.post(webhookUrl, discordPayload);
};

app.post(
  "/stripe",
  express.json({ type: "application/json" }),
  (request, response) => {
    const event = request.body;

    switch (event.type) {
      case "checkout.session.completed":
        const paymentCompleteEvent = event.data.object;
        console.log(paymentCompleteEvent);
        sendToDiscord(
          `<@&897216878672478229>  Ny betaling fra \`${paymentCompleteEvent.customer_details.email}\``
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    response.send();
  }
);

app.listen(port, () => console.log(`Running on port ${port}`));
