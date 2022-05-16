import { ButtonGroup, InlineError, TextField } from "@shopify/polaris";
import React from "react";


function RatingCellModal({ onSetValue, value, error }) {
  const currentRating = value ? JSON.parse(value) : {scale_min: "", scale_max: "", value: "" };
  const handleRatingInput = (key,value) => {
    onSetValue(JSON.stringify({
      ...currentRating,
      [key]: value
    }))
  }
  return (
    <>
    <ButtonGroup segmented fullWidth>
      <div>
        <TextField
          error={error ?  true : false}
          prefix="Rating"
          type="number"
          step="1"
          min={currentRating.scale_min}
          max={currentRating.scale_max}
          value={currentRating.value ? Number.parseInt(currentRating.value)?.toString() : ""}
          onChange={(value) => {
            handleRatingInput("value",value);
          }}
        />
      </div>
      <div style={{width: '100px'}}>
        <TextField
          type="number"
          step="1"
          error={error ?  true : false}
          prefix="Min"
          value={currentRating.scale_min ? Number.parseInt(currentRating.scale_min)?.toString() : ""}
          onChange={(value) => {
            handleRatingInput("scale_min",value);
          }}
        />
      </div>
      <div style={{width: '100px'}}>
        <TextField
          type="number"
          step="1"
          error={error ?  true : false}
          prefix="Max"
          value={currentRating.scale_max ? Number.parseInt(currentRating.scale_max)?.toString() : ""}
          onChange={(value) => {
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
