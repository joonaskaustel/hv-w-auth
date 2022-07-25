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
  const query = req.query;
  const { userId } = query;
  const { data, error } = await supabase
    .from('product')
    .select()
    .filter('userId', 'eq', userId);
  res.status(200).json(data as any);
}
