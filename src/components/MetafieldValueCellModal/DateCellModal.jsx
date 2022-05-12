import { TextField } from "@shopify/polaris";
import React from "react";

function DateCellModal({ onSetValue, value, error }) {
  return (
    <TextField
      min="1"
      error={error || false}
      value={value ? value : ""}
      type="date"
      onChange={(value) => {
        onSetValue(value);
      }}
    />
  );
}

export default DateCellModal;
