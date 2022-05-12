import { TextField } from "@shopify/polaris";
import React from "react";

function MultiLineCellModal({ onSetValue, value, error }) {
  return (
    <TextField
      value={value}
      error={error || false}
      multiline
      onChange={(value) => {
        onSetValue(value);
      }}
    />
  );
}

export default MultiLineCellModal;
