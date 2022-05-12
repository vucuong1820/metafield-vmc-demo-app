import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  InlineError,
  Popover,
  TextField,
} from "@shopify/polaris";
import { HexColorPicker } from "react-colorful";

function ColorCellModal({ onSetValue, value, error }) {
  const [activePopoverColor, setActivePopoverColor] = useState(false);

  const activatorColor = (
    <Button
      icon={
        <div className="color-point" style={{ backgroundColor: value }}></div>
      }
      onClick={() => setActivePopoverColor((prev) => !prev)}
      disclosure
    >
      Select color
    </Button>
  );

  return (
    <>
    <ButtonGroup segmented fullWidth>
      <Popover
        active={activePopoverColor}
        activator={activatorColor}
        autofocusTarget="first-node"
        onClose={() => setActivePopoverColor((prev) => !prev)}
      >
        <Card title="Choose your color">
          <Card.Section>
            <HexColorPicker
              color={value}
              onChange={(color) => {
                onSetValue(color);
              }}
            />
          </Card.Section>
        </Card>
      </Popover>
      <div>
        <TextField error={error ? true : false} value={value} onChange={onSetValue} />
      </div>
    </ButtonGroup>
    <InlineError message={error || ""} />
    </>
  );
}

export default ColorCellModal;
