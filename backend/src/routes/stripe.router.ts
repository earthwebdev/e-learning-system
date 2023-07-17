import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe( stripeSecretKey, {
    apiVersion: '2022-11-15', maxNetworkRetries: 1, timeout: 1000,
  });
const client_url = process.env.CLIENT_URL;
router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'T-shirt',
                  },
                  unit_amount: 30,
                },
                quantity: 1,
              },
              {
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: 'Pants',
                    },
                    unit_amount: 45,
                  },
                  quantity: 2,
                },
            ],
            mode: 'payment',
            success_url: `${client_url}/success`,
            cancel_url: `${client_url}/cart`,
          });
        
          //res.redirect(303, session.url);
          res.status(200).json({
              success: true,
              stripeUrl: session.url, 
          })
    } catch (error: any) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
  });
  

export default router;