import {Loader, ScrollArea, Table} from '@mantine/core';
import {useSession} from 'next-auth/react';
import {useProducts} from '../hooks/swr/useProducts';

const getChange = (newNum: number, oldNum: number) => {
    const change = newNum - oldNum;
    return Math.round((change / oldNum) * 100);
};

const getRows = (products: any) => {
  const  localeDateConfig: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return products?.map((product: any) => (
        <tr key={product.product.name}>
            <td>
                <a target="_blank" href={product.product.url} rel="noreferrer">
                    {product.product.name.replaceAll('-', ' ')}
                </a>
            </td>
            <td>{product.product.lastPrice - product.product.price} € / {getChange(product.product.price, product.product.lastPrice)} %</td>
            <td>{product.product.price} €</td>
            <td>
                {product.product.lastPrice
                    ? `${product.product.lastPrice} €`
                    : '-'}
            </td>
            <td>{new Date(product.product.updatedAt).toLocaleDateString('et', localeDateConfig)}</td>
        </tr>
    ));
};

const content = (products: any, isLoading: any, isError: any) => {
    if (isLoading) return <Loader />;
    if (isError)
        return <div>error fetching products {JSON.stringify(isError)}</div>;
    return (
      <ScrollArea>
        <Table>
            <thead>
                <tr>
                    <th>📦 Product</th>
                    <th>♻ You save</th>
                    <th>💰 Current</th>
                    <th>🕐 Last</th>
                    <th>🕐 Updated at</th>
                </tr>
            </thead>
            <tbody>{getRows(products)}</tbody>
        </Table>
      </ScrollArea>
    );
};

export default function ProductList() {
    const { data: session } = useSession();
    const { products, isLoading, isError } = useProducts(session?.dbUserId);

    return (
        <>
            <h1>Subscriptions</h1>
            {content(products, isLoading, isError)}
        </>
    );
}
