// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { productUrl, price, name, userId } = req.body;

  const { data, error } = await supabase
    .from('product')
    .insert({ url: productUrl, price, name, userId });

  if (error) {
    return res.status(400).json(error as any);
  }

  return res.status(200).json(data as any);
}
