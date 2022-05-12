import { useLazyQuery } from "@apollo/client";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Avatar, Button, InlineError } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { GET_VARIANT_BY_ID } from "../../gql";

function VariantCell({ onSetValue, value, error }) {
  const [variant, setVariant] = useState({});
  const [openVariantPicker, setOpenVariantPicker] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(true);
  const [getVariantById] = useLazyQuery(GET_VARIANT_BY_ID);

  useEffect(() => {
    (async () => {
      setIsBtnLoading(true);
      if (value) {
        const variantData = await getVariantById({
          variables: { id: value }
        });
        if (!variantData.loading && !!variantData.data)
        setVariant(variantData.data.productVariant);
      }

      setIsBtnLoading(false);
    })();
  }, [value]);

  return (
    <>
      <Button
        loading={isBtnLoading}
        fullWidth
        icon={<Avatar customer source={variant?.image || ""} />}
        disclosure="select"
        onClick={() => setOpenVariantPicker(true)}
      >
        {variant?.displayName || "Choose your variant"}
      </Button>
      {openVariantPicker && (
        <ResourcePicker // Resource picker component
          key="ProductVariantPicker"
          resourceType="ProductVariant"
          allowMultiple={false}
          showVariants={false}
          open={openVariantPicker}
          onSelection={(resources) => {
            onSetValue(resources.selection[0].id);
            setOpenVariantPicker(false);
          }}
          onCancel={() => setOpenVariantPicker(false)}
        />
      )}
      <InlineError message={error || ""} />
    </>
  );
}

export default VariantCell;
