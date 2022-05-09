import React, { useState } from "react";
import { TextField } from "@shopify/polaris";

function NumberDecimalCellModal({ onSetValue, value, error }) {
  return (
    <TextField
      type="number"
      error={error || false}
      step={0.1}
      value={value ? value : ""}
      onChange={(value) => {
        onSetValue(value);
      }}
    />
  );
}

export default NumberDecimalCellModal;
