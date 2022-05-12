import React, { useCallback, useState } from "react";
import {
  ActionList,
  Button,
  ButtonGroup,
  InlineError,
  Popover,
  TextField,
} from "@shopify/polaris";

function VolumeCell({ onSetValue, value, error }) {
  const volume = value ? JSON.parse(value) : { value: "", unit: "" };
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const handleChangeVolume = (key, value) => {
    onSetValue(JSON.stringify({ ...volume, [key]: value }));
  };
  const activator = (
    <div style={{color: error ? '#bf0711' : ''}} >
    <Button outline={error ? true : false } monochrome  onClick={toggleActive} disclosure>
    {volume.unit ? volume.unit : "Choose unit"}
  </Button>
  </div>
  );
  const listUnit = [
    {
      unit: "Mililit",
      id: "ml",
    },
    {
      unit: "Centilit",
      id: "cl",
    },
    {
      unit: "Lit",
      id: "l",
    },
    {
      unit: "cubic meters",
      id: "m3",
    },
    {
      unit: "",
      id: "us_fl_oz",
    },
    {
      unit: "",
      id: "us_pt",
    },
    {
      unit: "",
      id: "us_qt",
    },
    {
      unit: "",
      id: "us_gal",
    },
    {
      unit: "",
      id: "imp_fl_oz",
    },
    {
      unit: "",
      id: "imp_pt",
    },
    {
      unit: "",
      id: "imp_qt",
    },
    {
      unit: "",
      id: "imp_gal",
    },
  ];
  const listUnitMarkup = listUnit.map((item) => ({
    content: item.id,
    suffix: item.unit,
    onAction() {
      setActive(false);
      handleChangeVolume("unit", item.id);
    },
  }));
  return (
    <>
      <ButtonGroup fullWidth segmented>
        <div>
          <TextField
            error={error ? true : false}
            step={0.1}
            type="number"
            value={volume?.value ? volume.value.toString() : ""}
            onChange={(value) => handleChangeVolume("value", value)}
          />
        </div>
        <Popover
          active={active}
          activator={activator}
          autofocusTarget="first-node"
          onClose={toggleActive}
        >
          <div style={{ maxHeight: "280px" }}>
            <ActionList
              actionRole="menuitem"
              sections={[
                {
                  items: listUnitMarkup,
                },
              ]}
            />
          </div>
        </Popover>
      </ButtonGroup>
      <InlineError message={error || ""} />

    </>
  );
}

export default VolumeCell;
