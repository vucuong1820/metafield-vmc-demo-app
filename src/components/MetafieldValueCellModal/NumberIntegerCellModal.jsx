import React, { useState } from "react";
import { TextField } from "@shopify/polaris";

function NumberIntegerCellModal({ onSetValue, value, error }) {
  // const [value, setValue] = useState(0);
  return (
    <TextField
      error={error || false}
      type="number"
      value={value ? value : ""}
      onChange={(value) => {
        // setValue(value);
        onSetValue(value);
      }}
    />
  );
}

export default NumberIntegerCellModal;
