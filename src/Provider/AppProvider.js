import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GET_METAFIELD } from "../gql";
import { useQuery } from "@apollo/client";

export const AppContext = createContext();
function AppProvider({ children }) {
  const [selection, setSelection] = useState({});
  
  
 
//   const { loading, error, data, refetch } = React.useMemo(() => {
//     return useQuery(GET_METAFIELD, {
//       variables: { productId: selection?.payload?.id },
//     });
//   }, [selection]);
//   const productId = `gid://shopify/Product/${props.match.params.id}`;
//   let title, id;
//   if (!selection.payload) {
//     const { loading, error, data, refetch } = useQuery(GET_PRODUCT_BY_ID, {
//       variables: { productId },
//     });
//     title = data ? data.title : "Title not found!";
//     id = data ? data.id : "Product ID not found";
//   } else {
//     title = selection.payload.title;
//     id = selection.payload.id;
//   }
//   const { loading, error, data, refetch } = React.useMemo(() => {
//     return useQuery(GET_METAFIELD, {
//       variables: { productId: id || productId },
//     });
//   });
  return (
    <AppContext.Provider
      value={{ selection, setSelection, }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
