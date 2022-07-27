// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import sendgrid from "@sendgrid/mail";
import axios from 'axios';

type Data = {
  name: string
}

const sendEmail = (link: string, email: string, currentPrice: number) => {
  sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY as string);
  const msg = {
    to: email,
    from: 'joonas.kaustel@gmail.com',
    subject: 'Hinnateavitus',
    text: `Toode ${link} on nüüd odavam ja maksab ${currentPrice}€`,
    html: `<strong>Toode ${link} on nüüd odavam ja maksab  ${currentPrice}€</strong>`,
  };
  sendgrid.send(msg).then(() => {
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
  const { data: products, error } = await supabase
    .from('product')
    .select();

  if (!products) {
    return res.status(400).json(() => 'no data');
  }

  for (const item of products) {
    const url = item.url;
    const { data: fetchedProduct } = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/product/dataFromLink?url=${url}`);

    if (fetchedProduct.lowestPrice < item.price) {
      // update price
      const { data: updatedProduct, error } = await supabase
        .from('product')
        .update({ price: fetchedProduct.lowestPrice })
        .match({ id: item.id });

      await sendEmail(fetchedProduct.url, process.env.NEXT_PUBLIC_TEMPORARY_EMAIL_TO_SEND ?? '', fetchedProduct.lowestPrice);
    }

  }


  res.status(200).json(products as any);
}
