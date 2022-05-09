import { Button, ButtonGroup, InlineError } from "@shopify/polaris";
import React, { useState } from "react";
import { TickMinor, CancelSmallMinor } from "@shopify/polaris-icons";

function BooleanCellModal({ onSetValue, value, error }) {
  // const [isPressed, setIsPressed] = useState();
  return (
    <>
    <ButtonGroup fullWidth>
      <Button
        icon={TickMinor}
        pressed={value === "true"}
        onClick={() => {
          // setIsPressed("true");
          onSetValue("true");
        }}
      >
        True
      </Button>
      <Button
        icon={CancelSmallMinor}
        pressed={value === "false"}
        onClick={() => {
          // setIsPressed("false");
          onSetValue("false");
        }}
      >
        False
      </Button>
    </ButtonGroup>
    <InlineError message={error || ""} />
    </>
  );
}

export default BooleanCellModal;
