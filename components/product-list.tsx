import { Loader, Table } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useProducts } from '../hooks/swr/useProducts';

const getRows = (products: any) => {
    return products?.map((product: any) => (
        <tr key={product.product.name}>
            <td>
                <a target="_blank" href={product.product.url}>
                    {product.product.name.replaceAll('-', ' ')}
                </a>
            </td>
            <td>{product.product.price}</td>
        </tr>
    ));
};

const content = (products: any, isLoading: any, isError: any) => {
    if (isLoading) return <Loader />;
    if (isError)
        return <div>error fetching products {JSON.stringify(isError)}</div>;
    return (
        <Table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price €</th>
                </tr>
            </thead>
            <tbody>{getRows(products)}</tbody>
        </Table>
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
