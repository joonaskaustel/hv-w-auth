import {Loader, Table} from "@mantine/core";
import {useSession} from "next-auth/react";
import {useProducts} from "../hooks/swr/useProducts";

const getRows = (products: any) => {
  return products?.map((product: any) => (
    <tr key={product.name}>
      <td>{product.name}</td>
      <td><a target="_blank" href={product.url}>{product.url}</a></td>
      <td>{product.price}</td>
    </tr>
  ));
}

const content = (products: any, isLoading: any, isError: any) => {
  if (isLoading) return <Loader />
  if (isError) return <div>error fetching products {JSON.stringify(isError)}</div>
  return (
    <Table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Url</th>
        <th>Price €</th>
      </tr>
      </thead>
      <tbody>{getRows(products)}</tbody>
    </Table>
  )
}

export default function ProductList() {
  const {data: session } = useSession();
  const { products, isLoading, isError } = useProducts(session?.dbUserId);

  return (
    <>
      <h1>Products list</h1>
      {content(products, isLoading, isError)}
    </>
  )
}
