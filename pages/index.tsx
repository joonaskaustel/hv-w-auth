import Layout from "../components/layout"
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {ProductInterface} from "../types/product.interface";
import useSWR, {useSWRConfig} from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const getProductData = async (url: string, productUrl: string) => {
  const res = await fetch(`${url}?url=${productUrl}`);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const addProductData = async (productData: any, userId: number) => {
  const stringified = JSON.stringify({
    productUrl: productData.url,
    price: productData.lowestPrice,
    name: productData.name,
    userId,
  });

  const res = await fetch('/api/product/add', {
    method: 'POST',
    body: stringified,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};


export default function IndexPage() {

  const {query} = useRouter();
  const {data: session } = useSession();
  const {data: products, error} = useSWR<ProductInterface[]>(
    `/api/product/all?userId=${session?.dbUserId}`,
    fetcher,
  );

  const {mutate} = useSWRConfig();

  const addProductEventSubmit = async (event: any) => {
    event.preventDefault();
    const productUrl = event.target.productUrl.value;

    const productData = await getProductData(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/product/dataFromLink`, productUrl);
    console.log('productData ', productData);
    console.log('session ', session);
    const userId = session?.dbUserId as number;
    addProductData(productData, userId);
    mutate('/api/product/all');
  };

  return (
    <Layout>
      <div style={{maxWidth: '420px', margin: '96px auto'}}>

        <h1>Add product </h1>
        <form onSubmit={addProductEventSubmit}>
          <label htmlFor="productUrl">hinnavaatlus url </label>
          <input id="productUrl" type="text" required/>
          <button type="submit">add</button>
        </form>

        <h1>Products list </h1>
        {products && products.map((product, index: number) => {
          return (<li key={index}>{product.name} {product.url} {product.price}</li>);
        })}
      </div>
    </Layout>
  )
}
