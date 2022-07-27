import Layout from '../components/layout';
import ProductList from '../components/product-list';
import { AddProduct } from '../components/add-product';
import { useSession } from 'next-auth/react';

export default function IndexPage() {
    const { data: session, status } = useSession();

    console.log('session ', session);
    console.log('status ', status);

    return (
        <Layout>
            <div style={{ maxWidth: '800px', margin: '20px auto' }}>
                <AddProduct />

                {session && <ProductList />}
            </div>
        </Layout>
    );
}
