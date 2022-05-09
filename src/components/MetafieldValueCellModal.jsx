import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  ActionList,
  Avatar,
  Button,
  ButtonGroup,
  Card,
  ColorPicker,
  Icon,
  Popover,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import {
  TickMinor,
  CancelSmallMinor,
  ProductsMajor,
  AccessibilityMajor,
} from "@shopify/polaris-icons";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { HexColorPicker } from "react-colorful";

MetafieldValueCellModal.propTypes = {};

function MetafieldValueCellModal({ type, onSetValue }) {
  switch (type) {
    case "boolean":
      const [isPressed, setIsPressed] = useState();
      return (
        <ButtonGroup>
          <Button
            icon={TickMinor}
            pressed={isPressed === "true"}
            onClick={() => {
              setIsPressed("true");
              onSetValue(true);
            }}
          >
            True
          </Button>
          <Button
            icon={CancelSmallMinor}
            pressed={isPressed === "false"}
            onClick={() => {
              setIsPressed("false");
              onSetValue(false);
            }}
          >
            False
          </Button>
        </ButtonGroup>
      );
      break;
    case "date":
      const [date, setDate] = useState();
      return (
        <TextField
          min="1"
          value={date}
          type="date"
          onChange={(value) => {
            setDate(value);
            onSetValue(value);
          }}
        />
      );
      break;
    case "color":
      const [activePopoverColor, setActivePopoverColor] = useState(true);
      const [color, setColor] = useState("#b32aa9");
      const activatorColor = (
        <Button
          icon={
            <div
              className="color-point"
              style={{ backgroundColor: color }}
            ></div>
          }
          onClick={() => setActivePopoverColor((prev) => !prev)}
          disclosure
        >
          Select color
        </Button>
      );

      return (
        <ButtonGroup>
          <Popover
            active={activePopoverColor}
            activator={activatorColor}
            autofocusTarget="first-node"
            onClose={() => setActivePopoverColor((prev) => !prev)}
          >
            <Card title="Choose your color">
              <Card.Section>
                <HexColorPicker
                  color={color}
                  onChange={(color) => {
                    setColor(color);
                    onSetValue(color);
                  }}
                />
              </Card.Section>
            </Card>
          </Popover>
          <div style={{ maxWidth: "150px" }}>
            <TextField value={color} onChange={setColor} />
          </div>
        </ButtonGroup>
      );
    case "number_integer":
      const [value, setValue] = useState(0);
      return (
        <TextField
          type="number"
          value={value ? value : "0"}
          onChange={(value) => {
            setValue(value);
            onSetValue(Number.parseInt(value));
          }}
        />
      );
    case "number_decimal":
      const [valueDecimal, setValueDecimal] = useState(0);
      return (
        <TextField
          type="number"
          step={0.1}
          value={valueDecimal ? valueDecimal : "0"}
          onChange={(value) => {
            setValueDecimal(value);
            onSetValue(Number.parseFloat(value));
          }}
        />
      );
    case "product":
      console.log("product");
      const [product, setProduct] = useState({});
      const [openPicker, setOpenPicker] = useState(false);
      const handleOpen = () => {
        setOpenPicker(true);
      };
      console.log(product);
      console.log(openPicker);
      return (
        <>
          <Button
            icon={
              <Avatar
                customer
                source={product?.selection?.[0]?.images?.[0]?.originalSrc || ""}
              />
            }
            disclosure="select"
            onClick={handleOpen}
          >
            {product?.selection?.[0]?.title || "Choose a product"}
          </Button>
          <ResourcePicker // Resource picker component
            resourceType="Product"
            allowMultiple={false}
            showVariants={false}
            open={openPicker}
            onSelection={(resources) => {
              setProduct(resources);
              setOpenPicker(false);
              onSetValue(resources);
            }}
            onCancel={() => setOpenPicker(false)}
          />
        </>
      );
    case "dimension":
      const [dimension, setDimension] = useState();
      const [active, setActive] = useState(false);
      const toggleActive = useCallback(
        () => setActive((active) => !active),
        []
      );

      const activator = (
        <Button onClick={toggleActive} disclosure>
          {dimension ? dimension.unit : "Choose unit"}
        </Button>
      );
      const listUnit = [
        {
          unit: "inches",
          id: "in",
        },
        {
          unit: "feet",
          id: "ft",
        },
        {
          unit: "yards",
          id: "yd",
        },
        {
          unit: "milliliters",
          id: "mm",
        },
        {
          unit: "centimeters",
          id: "cm",
        },
        {
          unit: "meters",
          id: "m",
        },
      ];
      const listUnitMarkup = listUnit.map((item) => ({
        content: item.id,
        suffix: item.unit,
        onAction() {
          setActive(false);
          setDimension((prev) => ({ ...prev, unit: item.id }));
        },
      }));
      const handleChangeDimension = (value) => {
        setDimension((prev) => {
          onSetValue({ ...prev, value: Number.parseFloat(value) });
          return { ...prev, value };
        });
      };
      return (
        <>
          <ButtonGroup>
            <div style={{ maxWidth: "120px" }}>
              <TextField
                step={0.1}
                type="number"
                value={dimension?.value ? dimension.value : "0"}
                onChange={handleChangeDimension}
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
        </>
      );
    case "rating":
      const [rating, setRating] = useState(0);
      const [min, setMin] = useState(1);
      const [max, setMax] = useState(5);
      const [isError, setIsError] = useState(false);
      useEffect(() => {
        const newRating = Number.parseInt(rating);
        const newMin = Number.parseInt(min);
        const newMax = Number.parseInt(max);
        console.log({ newRating, newMin, newMax });

        if (
          Number.parseInt(rating) >= Number.parseInt(min) &&
          Number.parseInt(rating) <= Number.parseInt(max)
        ) {
          console.log("use eff true");
          setIsError(true);
        } else {
          console.log("use eff false");
          setIsError(false);
        }
      }, [rating, min, max]);
      return (
        <ButtonGroup>
          <div style={{ maxWidth: "120px" }}>
            <TextField
              prefix="Rating"
              type="number"
              error={!isError && "Out of range"}
              min={min}
              max={max}
              value={rating}
              onChange={(value) => {
                setRating(value);
                onSetValue({ value, scale_min: min, scale_max: max });
              }}
            />
          </div>
          <div style={{ maxWidth: "91px" }}>
            <TextField
              prefix="Min"
              value={min}
              onChange={(value) => {
                setMin(value);
                onSetValue({ value: rating, scale_min: value, scale_max: max });
              }}
            />
          </div>
          <div style={{ maxWidth: "91px" }}>
            <TextField
              prefix="Max"
              value={max}
              onChange={(value) => {
                setMax(value);
                onSetValue({ value: rating, scale_min: min, scale_max: value });
              }}
            />
          </div>
        </ButtonGroup>
      );
    case "single_line_text_field":
      const [singlineValue, setSingleLineValue] = useState("");
      return (
        <TextField
          value={singlineValue}
          onChange={(value) => {
            setSingleLineValue(value);
            onSetValue(value);
          }}
        />
      );
    case "multi_line_text_field":
      const [multilineValue, setMultilineValue] = useState("");
      return (
        <TextField
          value={multilineValue}
          multiline
          onChange={(value) => {
            setMultilineValue(value);
            onSetValue(value);
          }}
        />
      );
    default:
      return <TextField min="1" value="" />;
  }
  return (
    <TextField
      min="1"
      value={metafield?.key}
      onChange={(value) => setMetafield((prev) => ({ ...prev, key: value }))}
    />
  );
}

export default MetafieldValueCellModal;
