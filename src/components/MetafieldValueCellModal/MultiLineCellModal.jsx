import React, { useState } from "react";
import { TextField } from "@shopify/polaris";

function MultiLineCellModal({ onSetValue, value, error }) {
  // const [multilineValue, setMultilineValue] = useState("");
  // console.log('multiline:',value)
  return (
    <TextField
      value={value}
      error={error || false}
      multiline
      onChange={(value) => {
        // setMultilineValue(value);
        onSetValue(value);
      }}
    />
  );
}

export default MultiLineCellModal;
