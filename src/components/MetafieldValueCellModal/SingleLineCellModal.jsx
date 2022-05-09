import React, { useState } from "react";
import { TextField } from "@shopify/polaris";

function SingleLineCellModal({ onSetValue, value, error }) {
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

export default SingleLineCellModal;
