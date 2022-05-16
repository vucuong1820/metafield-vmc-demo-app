import { } from "@shopify/app-bridge-react";
import {
  ActionList,
  Button,
  Card,
  Icon,
  IndexTable,
  Modal,
  Popover,
  TextField
} from "@shopify/polaris";
import {
  AnalyticsMajor, AttachmentMajor,
  CalendarMajor,
  CategoriesMajor, CircleDisableMinor, ClockMajor, CodeMajor, ColorsMajor,
  FavoriteMajor,
  GlobeMajor,
  HashtagMajor, PageMajor, ProductsMajor,
  RefreshMajor, TransactionMajor, TypeMajor, VariantMajor
} from "@shopify/polaris-icons";
import React, { useCallback, useEffect, useState } from "react";
import BooleanCellModal from "./MetafieldValueCellModal/BooleanCellModal";
import ColorCellModal from "./MetafieldValueCellModal/ColorCellModal";
import DateCellModal from "./MetafieldValueCellModal/DateCellModal";
import DateTimeCell from "./MetafieldValueCellModal/DateTimeCell";
import DefaultCell from "./MetafieldValueCellModal/DefaultCell";
import DimensionCellModal from "./MetafieldValueCellModal/DimensionCellModal";
import FileCellModal from "./MetafieldValueCellModal/FileCellModal";
import IntegerCell from "./MetafieldValueCellModal/IntegerCell";
import JsonCell from "./MetafieldValueCellModal/JsonCell";
import JsonStringCell from "./MetafieldValueCellModal/JsonStringCell";
import MultiLineCellModal from "./MetafieldValueCellModal/MultiLineCellModal";
import NumberDecimalCellModal from "./MetafieldValueCellModal/NumberDecimalCellModal";
import NumberIntegerCellModal from "./MetafieldValueCellModal/NumberIntegerCellModal";
import PageCell from "./MetafieldValueCellModal/PageCell";
import ProductCellModal from "./MetafieldValueCellModal/ProductCellModal";
import RatingCellModal from "./MetafieldValueCellModal/RatingCellModal";
import SingleLineCellModal from "./MetafieldValueCellModal/SingleLineCellModal";
import StringCell from "./MetafieldValueCellModal/StringCell";
import UrlCellModal from "./MetafieldValueCellModal/UrlCellModal";
import VariantCell from "./MetafieldValueCellModal/VariantCell";
import VolumeCell from "./MetafieldValueCellModal/VolumeCell";
import WeightCell from "./MetafieldValueCellModal/WeightCell";

AddMetafieldModal.propTypes = {};

function AddMetafieldModal({
  openModal,
  setOpenModal,
  onAddMetafield,
  ownerId,
  errorsList,
  setErrorsList,
}) {
  const [active, setActive] = useState(true);
  const [type, setType] = useState("single_line_text_field");
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [metafield, setMetafield] = useState({
    namespace: "",
    key: "",
    value: "",
  });
  const validateField = useCallback((metafieldInput) => {
    for (const field in metafieldInput) {
      if (metafieldInput[field].trim().length <= 0) return false;
    }
    return true;
  }, []);

  useEffect(() => {
    setDisabled(!validateField(metafield));
  }, [metafield]);

  const handleSetValue = (newValue) => {
    setMetafield((prev) => ({ ...prev, value: newValue }));
    const newErrorsList = [...errorsList];
    const indexFieldChanged = errorsList.findIndex(
      (x) => x.field === "value"
    );
    if (newErrorsList[indexFieldChanged]?.message) {
      newErrorsList[indexFieldChanged].message = "";
      setErrorsList(newErrorsList);
    }
  };
  const switchTypeValue = (type) => {
    switch (type) {
      case "single_line_text_field":
        return {
          title: "Single line text",
          icon: TypeMajor,
          render: (
            <SingleLineCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              disabled={disabled}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "multi_line_text_field":
        return {
          title: "Multi line text",
          icon: CategoriesMajor,
          render: (
            <MultiLineCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              disabled={disabled}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "boolean":
        return {
          title: "Boolean",
          icon: RefreshMajor,
          render: (
            <BooleanCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              disabled={disabled}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "color":
        return {
          title: "Color",
          icon: ColorsMajor,
          render: (
            <ColorCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              disabled={disabled}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "date":
        return {
          title: "Date",
          icon: CalendarMajor,
          render: (
            <DateCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              disabled={disabled}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "date_time":
        return {
          title: "Date and time",
          icon: ClockMajor,
          render: (
            <DateTimeCell
              productId={ownerId}
              onSetValue={handleSetValue}
              value={metafield.value}
              disabled={disabled}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "number_decimal":
        return {
          title: "Decimal",
          icon: HashtagMajor,
          render: (
            <NumberDecimalCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "number_integer":
        return {
          title: "Integer",
          icon: HashtagMajor,
          render: (
            <NumberIntegerCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "dimension":
        return {
          title: "Dimension",
          icon: HashtagMajor,
          render: (
            <DimensionCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "rating":
        return {
          title: "Rating",
          icon: FavoriteMajor,
          render: (
            <RatingCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "weight":
        return {
          title: "Weight",
          icon: TransactionMajor,
          render: (
            <WeightCell
              productId={ownerId}
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "volume":
        return {
          title: "Volume",
          icon: AnalyticsMajor,
          render: (
            <VolumeCell
              productId={ownerId}
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "product_reference":
        return {
          title: "Product",
          icon: ProductsMajor,
          render: (
            <ProductCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };

      case "file_reference":
        return {
          title: "File",
          icon: AttachmentMajor,
          render: (
            <FileCellModal
              productId={ownerId}
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "variant_reference":
        return {
          title: "Variant",
          icon: VariantMajor,
          render: (
            <VariantCell
              productId={ownerId}
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
      case "url":
        return {
          title: "URL",
          icon: GlobeMajor,
          render: (
            <UrlCellModal
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };

      case "json":
        return {
          title: "JSON String",
          icon: CodeMajor,
          render: (
            <JsonCell
              productId={ownerId}
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };

      case "page_reference":
        return {
          title: "Page",
          icon: PageMajor,
          render: (
            <PageCell
              productId={ownerId}
              onSetValue={handleSetValue}
              value={metafield.value}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
        case "integer":
        return {
          title: "Interger (Old)",
          icon: HashtagMajor,
          render: (
            <IntegerCell
              onSetValue={handleSetValue}
              value={metafield.value}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
        case "string":
        return {
          title: "String (Old)",
          icon: TypeMajor,
          render: (
            <StringCell
              onSetValue={handleSetValue}
              value={metafield.value}
              disabled={disabled}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
        case "json_string":
        return {
          title: "JSON String (Old)",
          icon: CodeMajor,
          render: (
            <JsonStringCell
              onSetValue={handleSetValue}
              value={metafield.value}
              disabled={disabled}
              setDisabled={setDisabled}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
        
      default:
        return {
          title: "Default",
          icon: CircleDisableMinor,
          render: (
            <DefaultCell
              productId={ownerId}
              onSetValue={handleSetValue}
              value={metafield.value}
              error={
                errorsList?.find((item) => item.field === "value")?.message ||
                false
              }
            />
          ),
        };
    }
  };
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const activator = (
    <Button onClick={toggleActive} disclosure>
      <Icon source={switchTypeValue(type).icon} color="base" />
    </Button>
  );
  const listType2 = [
    "single_line_text_field",
    "boolean",
    "color",
    "date",
    "number_decimal",
    "number_integer",
    "dimension",
    "product_reference",
    "rating",
    "multi_line_text_field",
    "url",
    "file_reference",
    "json",
    "weight",
    "volume",
    "variant_reference",
    "date_time",
    "page_reference",
    "integer",
    "string",
    "json_string",
  ];
  const listTypeMarkup = listType2.map((item) => ({
    active: type === item,
    content: switchTypeValue(item).title,
    icon: switchTypeValue(item).icon,
    onAction: () => {
      setActive(false);
      setType(item);
      setMetafield({ namespace: "", key: "", value: "" });
      setErrorsList([])
    },
  }));

  const handleAddClick = async () => {
    setIsAddLoading(true);
    if (type === "date_time") {
      const result = await onAddMetafield({
        ...metafield,
        type,
        ownerId: ownerId,
        value: `${metafield.value}:00+00:00`,
      });
      setIsAddLoading(false);
      if (result === "success") {
        setMetafield({ namespace: "", key: "", value: "" });
        setOpenModal(false);
      }
    } else {
      // console.log("start save");
      const result = await onAddMetafield({
        ...metafield,
        type,
        ownerId: ownerId,
      });
      setIsAddLoading(false);
      if (result === "success") {
        setMetafield({ namespace: "", key: "", value: "" });
        setOpenModal(false);
      }
    }

  };
  return (
    <Modal
      large
      title="Add new metafield"
      open={openModal}
      onClose={() => {
        setOpenModal(false);
        setMetafield({ namespace: "", key: "", value: "" });
      }}
    >
      <Card.Section>
        <IndexTable
          resourceName={{ singular: "metafield", plural: "metafields" }}
          itemCount={3}
          headings={[
            { title: "Type" },
            { title: "Namespace" },
            { title: "Key" },
            { title: "Value" },
            { title: "Actions" },
          ]}
          selectable={false}
        >
          <IndexTable.Row>
            <IndexTable.Cell>
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
                        items: listTypeMarkup,
                      },
                    ]}
                  />
                </div>
              </Popover>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <div style={{ maxWidth: "163px" }}>
                <TextField
                  min="1"
                  value={metafield?.namespace}
                  error={
                    errorsList?.find((item) => item.field === "namespace")
                      ?.message || false
                  }
                  onChange={(value) => {
                    value?.trim().length <= 0
                      ? setDisabled(true)
                      : setDisabled(false);
                    setMetafield((prev) => ({ ...prev, namespace: value }));
                    const newErrorsList = [...errorsList];
                    const indexFieldChanged = errorsList.findIndex(
                      (x) => x.field === "namespace"
                    );
                    if (newErrorsList[indexFieldChanged]?.message) {
                      newErrorsList[indexFieldChanged].message = "";
                      setErrorsList(newErrorsList);
                    }
                  }}
                />
              </div>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <div style={{ maxWidth: "163px" }}>
                <TextField
                  min="1"
                  value={metafield?.key}
                  error={
                    errorsList?.find((item) => item.field === "key")?.message ||
                    false
                  }
                  onChange={(value) => {
                    value?.trim().length <= 0
                      ? setDisabled(true)
                      : setDisabled(false);
                    setMetafield((prev) => ({ ...prev, key: value }));
                    const newErrorsList = [...errorsList];
                    const indexFieldChanged = errorsList.findIndex(
                      (x) => x.field === "key"
                    );
                    if (newErrorsList[indexFieldChanged]?.message) {
                      newErrorsList[indexFieldChanged].message = "";
                      setErrorsList(newErrorsList);
                    }
                  }}
                />
              </div>
            </IndexTable.Cell>

            <IndexTable.Cell>
              
              {switchTypeValue(type).render}
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Button
                disabled={disabled}
                loading={isAddLoading}
                primary
                onClick={handleAddClick}
              >
                Add
              </Button>
            </IndexTable.Cell>
          </IndexTable.Row>
        </IndexTable>
      </Card.Section>
    </Modal>
  );
}

export default React.memo(AddMetafieldModal);
