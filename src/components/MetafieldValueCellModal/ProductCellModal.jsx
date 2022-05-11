import { useQuery } from "@apollo/client";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Avatar, Button, InlineError } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { GET_PRODUCT_BY_ID } from "../../gql";

function ProductCellModal({ onSetValue, value, error }) {
  const [skip, setSkip] = React.useState(false);
  const [product, setProduct] = useState({});
  const [sourceAvatar, setSourceAvatar] = useState("");
  const { loading, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { productId: value },
    skip,
  });
  useEffect(() => {
    if (!loading && !!data) {
      setSkip(true);
      setProduct(data);
    }
  }, [data, loading]);
  const [openProductPicker, setOpenProductPicker] = useState(false);
  return (
    <>
      <Button
        fullWidth
        icon={
          <Avatar
            customer
            source={sourceAvatar || product?.product?.featuredImage.url}
          />
        }
        disclosure="select"
        onClick={() => setOpenProductPicker(true)}
      >
        {product?.selection?.[0]?.title || "Choose a product"}
      </Button>
      <ResourcePicker // Resource picker component
        resourceType="Product"
        allowMultiple={false}
        showVariants={false}
        open={openProductPicker}
        onSelection={(resources) => {
          // setProduct(resources);
          setOpenProductPicker(false);
          // onSetValue(resources);
          setSourceAvatar(resources.selection[0].images[0].originalSrc);
          onSetValue(resources.selection[0].id);
        }}
        onCancel={() => setOpenProductPicker(false)}
      />
      <InlineError message={error || ""} />
    </>
  );
}

export default ProductCellModal;
