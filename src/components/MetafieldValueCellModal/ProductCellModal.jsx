import { useLazyQuery } from "@apollo/client";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Avatar, Button, InlineError } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { GET_PRODUCT_BY_ID } from "../../gql";

function ProductCellModal({ onSetValue, value, error }) {
  // const [skip, setSkip] = useState(false);
  const [openProductPicker, setOpenProductPicker] = useState(false);
  const [product, setProduct] = useState({});
  const [isBtnLoading, setIsBtnLoading] = useState(true);
  const [getProductById] = useLazyQuery(GET_PRODUCT_BY_ID);
  useEffect(() => {
    (async () => {
      setIsBtnLoading(true);
      if (value) {
        const productData = await getProductById({
          variables: { productId: value },
        });
        if (!productData.loading && !!productData.data)
          setProduct(productData.data);
      }

      setIsBtnLoading(false);
    })();
  }, [value]);

  // useEffect(() => {
  //   if (!loading && !!data) {
  //     setProduct(data);
  //   }
  // }, [data, loading]);
  return (
    <>
      <Button
        loading={isBtnLoading}
        fullWidth
        icon={
          <Avatar
            customer
            source={product?.product?.featuredImage?.url || ""}
          />
        }
        disclosure="select"
        onClick={() => setOpenProductPicker(true)}
      >
        {product?.product?.title || "Choose a product"}
      </Button>
      {openProductPicker && (
        <ResourcePicker // Resource picker component
          key="ProductPicker"
          resourceType="Product"
          allowMultiple={false}
          showVariants={false}
          open={openProductPicker}
          onSelection={(resources) => {
            onSetValue(resources.selection[0].id);
            setOpenProductPicker(false);
          }}
          onCancel={() => setOpenProductPicker(false)}
        />
      )}
      <InlineError message={error || ""} />
    </>
  );
}

export default ProductCellModal;
