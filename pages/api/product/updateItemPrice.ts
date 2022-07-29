import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import sendgrid from '@sendgrid/mail';
import axios from 'axios';

type Data = {
    name: string;
};

const sendEmail = (
    link: string,
    email: string,
    currentPrice: number,
    lastPrice: number
) => {
    sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY as string);
    const msg = {
        to: email,
        from: 'pricealert@pricify.com',
        subject: 'Price alert',
        text: `Product ${link} is now cheaper and costs ${currentPrice}€ instead of ${lastPrice}€`,
        html: `<strong>Product ${link} is now cheaper and costs ${currentPrice}€ instead of ${lastPrice}€</strong>`,
    };
    sendgrid
        .send(msg)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};

export default async function handler(
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
