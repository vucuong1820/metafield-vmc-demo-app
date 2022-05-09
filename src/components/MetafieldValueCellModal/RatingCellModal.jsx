import React, { useEffect, useState } from "react";
import { ButtonGroup, InlineError, TextField } from "@shopify/polaris";


function RatingCellModal({ onSetValue, value, error }) {
  const currentRating = value ? JSON.parse(value) : {scale_min: "", scale_max: "", value: "" };
  // const [rating, setRating] = useState("3");
  // const [min, setMin] = useState("1");
  // const [max, setMax] = useState("5");
  const [isError, setIsError] = useState(false);
  const handleRatingInput = (key,value) => {
    onSetValue(JSON.stringify({
      ...currentRating,
      [key]: value
    }))
  }
  return (
    <>
    <ButtonGroup>
      <div style={{ maxWidth: "120px" }}>
        <TextField
          error={error ?  true : false}
          prefix="Rating"
          type="number"
          // error={!isError && "Out of range"}
          min={currentRating.scale_min}
          max={currentRating.scale_max}
          value={currentRating.value}
          onChange={(value) => {
            // setRating(value);
            handleRatingInput("value",value);
          }}
        />
      </div>
      <div style={{ maxWidth: "91px" }}>
        <TextField
          error={error ?  true : false}
          prefix="Min"
          value={currentRating.scale_min}
          onChange={(value) => {
            // setMin(value);
            handleRatingInput("scale_min",value);
          }}
        />
      </div>
      <div style={{ maxWidth: "91px" }}>
        <TextField
          error={error ?  true : false}
          prefix="Max"
          value={currentRating.scale_max}
          onChange={(value) => {
            // setMax(value);
            handleRatingInput("scale_max",value)
          }}
        />
      </div>
    </ButtonGroup>
    <InlineError message={error || ""} />

    </>
  );
}

export default RatingCellModal;
