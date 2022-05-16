import { TextField } from "@shopify/polaris";
import React from "react";

function StringCell({ onSetValue, value, error }) {
  return (
    <TextField
      error={error || false}
      value={value || ""}
      onChange={(value) => {
        onSetValue(value);
      }}
    />
  );
}

export default StringCell;
