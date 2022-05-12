import { TextField } from "@shopify/polaris";
import React from "react";
JsonCell.propTypes = {};

function JsonCell({ onSetValue, value, error }) {

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

export default JsonCell;
