import Layout from "../components/layout"
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {ProductInterface} from "../types/product.interface";
import useSWR, {useSWRConfig} from "swr";
import {Box, Button, Group, Loader, TextInput} from "@mantine/core";
import {useForm} from '@mantine/form';
import ProductList from "../components/product-list";

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

  const form = useForm({
    initialValues: {
      link: '',
      termsOfService: false,
    },
    validate: {
      link: (value) => (value ? null : 'Invalid link'),
    },
  });

  const {mutate} = useSWRConfig();

  const addProductEventSubmit = async (values: any) => {
    const productUrl = values.link;

    const productData = await getProductData(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/product/dataFromLink`, productUrl);
    const userId = session?.dbUserId as number;
    addProductData(productData, userId);
    mutate('/api/product/all');
    form.reset();
  };

  return (
    <Layout>
      <div style={{maxWidth: '420px', margin: '96px auto'}}>

        {/* TODO: make adding item into a component */}
        <h1>Add product </h1>
        <Box sx={{ maxWidth: 500, minWidth: 300 }} mx="auto">
          <form onSubmit={form.onSubmit((values) => addProductEventSubmit(values))}>
            <TextInput
              required
              label="HV product url"
              placeholder="https://www.hinnavaatlus.ee/2197459/apple-iphone-13-128gb-midnight/"
              {...form.getInputProps('link')}
            />

            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>

        <ProductList/>
      </div>
    </Layout>
  )
}
