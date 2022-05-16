import { TextField } from "@shopify/polaris";
import React from "react";

function IntegerCell({ onSetValue, value, error }) {
  return (
    <TextField
      error={error || false}
      type="number"
      value={value ? value : ""}
      onChange={(value) => {
        onSetValue(value);
      }}
    />
  );
}

export default IntegerCell;
