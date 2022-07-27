import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';

type Data = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { productUrl, price, name, userId } = req.body;

    console.log('reqbody ', req.body);

    // check if product already exists
    const { data: productExists, error: err } = await supabase
        .from('product')
        .select('*')
        .filter('url', 'eq', productUrl);

    if (!productExists?.length) {
        const { data, error } = await supabase
            .from('product')
            .insert({ url: productUrl, price, name });

        if (error) {
            return res.status(400).json(error as any);
        }

        const { data: userProducts, error: erraw } = await supabase
            .from('user-products')
            .insert({ userId, productId: data[0].id });

        return res.status(200).json(data as any);
    }

    const { data: userProducts, error: erraw } = await supabase
        .from('user-products')
        .insert({
            userId: Number(userId),
            productId: productExists[0].id,
        });

    console.log('erraw ', erraw);

    return res.status(200).json(userProducts as any);
}
