import { TextField } from "@shopify/polaris";
import React from "react";

function DateTimeCell({ onSetValue, value, error }) {
  const handleValueDateTime = () => {
      if(value && value.includes(":00+00:00")){
          return value.slice(0,value.indexOf(":00+00:00"))
      }
      return value
  }
  return (
    <TextField
      min="1"
      error={error || false}
      value={handleValueDateTime(value) || ""}
      type="datetime-local"
      onChange={(value) => {
        onSetValue(value);
      }}
    />
  );
}

export default DateTimeCell;
