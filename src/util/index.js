import { useQuery, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { GET_METAFIELD, GET_PRODUCT_BY_ID } from "../gql";

export const getProductInfoById = async (id) => {
  const [getProductInfo, { loading, data }] = useLazyQuery(GET_PRODUCT_BY_ID);
  await getProductInfo({
    variables: { productId: id },
  });
  const product = data;
  return { product };
};

export const getMetafieldsByProductId = (productId) => {
  const [metafieldsList, setMetafieldsList] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_METAFIELD, {
    variables: { productId: productId },
  });
  // const [metafieldsList, setMetafieldsList] = useState(() => data?.product.metafields.edges.map(item => item.node))
  setMetafieldsList(data?.product.metafields.edges.map((item) => item.node));
  // console.log(metafieldsList, productId, data);
  return { loading, metafieldsList, setMetafieldsList };
};

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
