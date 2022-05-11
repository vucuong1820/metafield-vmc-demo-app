import {} from "@shopify/app-bridge-react";
import {
  ActionList,
  Button,
  Card,
  Icon,
  IndexTable,
  Modal,
  Popover,
  TextField,
  Toast,
} from "@shopify/polaris";
import {
  AttachmentMajor,
  CalendarMajor,
  CategoriesMajor,
  ColorsMajor,
  FavoriteMajor,
  GlobeMajor,
  HashtagMajor,
  ProductsMajor,
  RefreshMajor,
  TypeMajor,
  CodeMajor,
  TransactionMajor,
  AnalyticsMajor,
  VariantMajor,
  ClockMajor,
  PageMajor,
  CircleDisableMinor
} from "@shopify/polaris-icons";
import React, { useCallback, useEffect, useState } from "react";
import BooleanCellModal from "./MetafieldValueCellModal/BooleanCellModal";
import ColorCellModal from "./MetafieldValueCellModal/ColorCellModal";
import DateCellModal from "./MetafieldValueCellModal/DateCellModal";
import DateTimeCell from "./MetafieldValueCellModal/DateTimeCell";
import DefaultCell from "./MetafieldValueCellModal/DefaultCell";
import DimensionCellModal from "./MetafieldValueCellModal/DimensionCellModal";
import FileCellModal from "./MetafieldValueCellModal/FileCellModal";
import JsonCell from "./MetafieldValueCellModal/JsonCell";
import MultiLineCellModal from "./MetafieldValueCellModal/MultiLineCellModal";
import NumberDecimalCellModal from "./MetafieldValueCellModal/NumberDecimalCellModal";
import NumberIntegerCellModal from "./MetafieldValueCellModal/NumberIntegerCellModal";
import PageCell from "./MetafieldValueCellModal/PageCell";
import ProductCellModal from "./MetafieldValueCellModal/ProductCellModal";
import RatingCellModal from "./MetafieldValueCellModal/RatingCellModal";
import SingleLineCellModal from "./MetafieldValueCellModal/SingleLineCellModal";
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
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isError, setIsError] = useState({
    key: false,
    namespace: false,
    value: false,
  });
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
      default:
        return {
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
  ];
  const listTypeMarkup = listType2.map((item) => ({
    content: item,
    icon: switchTypeValue(item).icon,
    onAction() {
      setActive(false);
      setType(item);
      setMetafield({ namespace: "", key: "", value: "" });
    },
  }));

  const handleAddClick = async () => {
    setIsAddLoading(true);
    setIsError({ key: false, namespace: false, value: false });
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
      console.log("start save");
      const result = await onAddMetafield({
        ...metafield,
        type,
        ownerId: ownerId,
      });
      setIsAddLoading(false);
      // setOpenModal(false);
      if (result === "success") {
        setMetafield({ namespace: "", key: "", value: "" });
        setOpenModal(false);
      }
    }

    // console.log(metafield, type, productId);
  };
  return (
    <Modal
      large
      title="Add new metafield"
      open={openModal}
      onClose={() => {
        setOpenModal(false);
        setMetafield({ namespace: "", key: "", value: "" });
        setIsError({ key: false, namespace: false, value: false });
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
              {/* <MetafieldValueCellModal
                type={type}
                onSetValue={handleSetValue}
              /> */}
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
