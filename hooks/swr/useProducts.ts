import useSWR from "swr";
import {ProductInterface} from "../../types/product.interface";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};


export function useProducts (userId: any) {
  const {data, error} = useSWR<ProductInterface[]>(
    `/api/product/all?userId=${userId}`,
    fetcher,
  );
  return {
    products: data,
    isLoading: !error && !data,
    isError: error
  }
}
