import { TextField } from "@shopify/polaris";
import React from "react";

function JsonStringCell({ onSetValue, value, error }) {

  return (
    <div>
      <TextField 
      error={error || false}
      value={value}
      onChange={(value) => onSetValue(value)}
      />
    </div>
  );
}

export default JsonStringCell;
