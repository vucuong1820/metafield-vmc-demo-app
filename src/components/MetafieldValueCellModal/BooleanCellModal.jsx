import { Button, ButtonGroup, InlineError } from "@shopify/polaris";
import { CancelSmallMinor, TickMinor } from "@shopify/polaris-icons";
import React from "react";

function BooleanCellModal({ onSetValue, value, error }) {
  return (
    <>
    <ButtonGroup fullWidth segmented>
      <Button
        icon={TickMinor}
        pressed={value === "true"}
        onClick={() => {
          onSetValue("true");
        }}
      >
        True
      </Button>
      <Button
        icon={CancelSmallMinor}
        pressed={value === "false"}
        onClick={() => {
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
