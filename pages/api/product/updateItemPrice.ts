import type {NextApiRequest, NextApiResponse} from 'next';
import {supabase} from '../../../utils/supabaseClient';
import axios from 'axios';
import Mailjet from 'node-mailjet';
import {withSentry} from '@sentry/nextjs';

type Data = {
    name: string;
};


const sendEmail = (
    link: string,
    email: string,
    currentPrice: number,
    lastPrice: number
) => {
    const mailjet = Mailjet.apiConnect(
      process.env.NEXT_PUBLIC_EMAIL_CLIENT_API_KEY as string,
      process.env.NEXT_PUBLIC_EMAIL_CLIENT_SECRET_KEY as string,
    );
    const request = mailjet.post('send', { version: 'v3.1' })
      .request({
          Messages:[
              {
                  From: {
                      Email: "joonas.kaustel@gmail.com",
                      Name: "Joonas"
                  },
                  Sender: {
                      Email: "joonas.kaustel@gmail.com",
                      Name: "Joonas"
                  },
                  To: [
                      {
                          Email: email,
                      }
                  ],
                  Subject: 'Price alert',
                  TextPart: `Product ${link} price is changed and costs ${currentPrice}€ instead of ${lastPrice}€`,
                  HTMLPart: `<strong>Product ${link} price is changed and costs ${currentPrice}€ instead of ${lastPrice}€</strong>`,
                  CustomID: "AppGettingStartedTest"
              }
          ]
      })
    request
      .then((result) => {
          console.log('email 1', result.body)
      })
      .catch((err) => {
          console.log('err ', err)
          console.log('email2 ', err.statusCode)
      })
};

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { data: products, error } = await supabase.from('product').select();

    if (!products) {
        return res.status(400).json(() => 'no data');
    }

    for (const item of products) {
        const url = item.url;
        // todo add product hv link validation
        const { data: fetchedProduct, status } = await axios.get(
            `${process.env.NEXT_PUBLIC_APP_API_URL}/api/product/dataFromLink?url=${url}`
        );

        if (fetchedProduct.lowestPrice < item.price) {
            // get all users that have that product
            const { data: users, error: userProductErrors } = await supabase
                .from('user-products')
                .select('*, user:user(*)')
                .filter('productId', 'eq', item.id);

            users?.forEach((user) => {
                sendEmail(
                    fetchedProduct.url,
                    user.user.email,
                    fetchedProduct.lowestPrice,
                    item.price
                );
            });

            // update price
            const { data: updatedProduct, error } = await supabase
                .from('product')
                .update({
                    price: fetchedProduct.lowestPrice,
                    lastPrice: item.price,
                    updatedAt: 'now()',
                })
                .match({ id: item.id });
        }
    }

    res.status(200).json(products as any);
}

export default withSentry(handler);
