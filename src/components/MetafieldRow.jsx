import {
  Button,
  ButtonGroup,
  IndexTable,
  Modal,
  TextField,
} from "@shopify/polaris";
import {
  AttachmentMajor,
  CalendarMajor,
  CategoriesMajor,
  CodeMajor,
  ColorsMajor,
  FavoriteMajor,
  GlobeMajor,
  HashtagMajor,
  ProductsMajor,
  RefreshMajor,
  TransactionMajor,
  TypeMajor,
  AnalyticsMajor,
  ClockMajor,
  PageMajor,
  VariantMajor,
  CircleDisableMinor,
} from "@shopify/polaris-icons";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
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

MetafieldRow.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.object,
};

function MetafieldRow({
  item = {},
  onChangeMetafield,
  onDeleteMetafield,
  currentItem,
  onSaveMetafield,
  error,
  setErrorsList,
}) {
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteBtnRef = useRef(null);
  const { namespace, key, value, type, id } = item;
  const handleValue = (newValue) => {
    onChangeMetafield(newValue, id);
    setErrorsList((prev) => {
      const index = prev.findIndex((x) => x.id === id);
      if (prev[index]?.message) {
        prev[index].message = "";
      }
      return prev;
    });
  };
  const switchTypeValue = (type) => {
    switch (type) {
      case "single_line_text_field":
        return {
          title: "Single line text",
          icon: TypeMajor,
          render: (
            <SingleLineCellModal
              onSetValue={(newValue) => handleValue(newValue)}
              value={value}
              error={error?.message || false}
              // error={errorsList.find(item => item.field === "value")?.message || false}
            />
          ),
        };
      case "multi_line_text_field":
        return {
          title: "Multi line text",

          icon: CategoriesMajor,
          render: (
            <MultiLineCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "boolean":
        return {
          title: "Boolean",
          icon: RefreshMajor,
          render: (
            <BooleanCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "color":
        return {
          title: "Color",
          icon: ColorsMajor,
          render: (
            <ColorCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "date":
        return {
          title: "Date",
          icon: CalendarMajor,
          render: (
            <DateCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "date_time":
        return {
          title: "Date and time",
          icon: ClockMajor,
          render: (
            <DateTimeCell
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "number_decimal":
        return {
          title: "Decimal",
          icon: HashtagMajor,
          render: (
            <NumberDecimalCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "number_integer":
        return {
          title: "Integer",
          icon: HashtagMajor,
          render: (
            <NumberIntegerCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "dimension":
        return {
          title: "Dimension",
          icon: HashtagMajor,
          render: (
            <DimensionCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "product_reference":
        return {
          title: "Product",
          icon: ProductsMajor,
          render: (
            <ProductCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "file_reference":
        return {
          title: "File",
          icon: AttachmentMajor,
          render: (
            <FileCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "variant_reference":
        return {
          title: "Variant",
          icon: VariantMajor,
          render: (
            <VariantCell
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "rating":
        return {
          title: "Rating",
          icon: FavoriteMajor,
          render: (
            <RatingCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "volume":
        return {
          title: "Volume",
          icon: AnalyticsMajor,
          render: (
            <VolumeCell
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "weight":
        return {
          title: "Weight",
          icon: TransactionMajor,
          render: (
            <WeightCell
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
      case "url":
        return {
          title: "URL",
          icon: GlobeMajor,
          render: (
            <UrlCellModal
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };

      case "json":
        return {
          title: "JSON String",
          icon: CodeMajor,
          render: (
            <JsonCell
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };

      case "page_reference":
        return {
          title: "Page",
          icon: PageMajor,
          render: (
            <PageCell
              key={key}
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
        case "integer":
        return {
          title: "Interger (Old)",
          icon: HashtagMajor,
          render: (
            <IntegerCell
            onSetValue={handleValue}
            value={value}
            error={error?.message || false}
            />
          ),
        };
        case "string":
        return {
          title: "String (Old)",
          icon: TypeMajor,
          render: (
            <StringCell
            onSetValue={(newValue) => handleValue(newValue)}
            value={value}
            error={error?.message || false}
            />
          ),
        };
        case "json_string":
        return {
          title: "JSON String (Old)",
          icon: CodeMajor,
          render: (
            <JsonStringCell
            onSetValue={handleValue}
            value={value}
            error={error?.message || false}
            />
          ),
        };

      default:
        return {
          title: "Default",
          icon: CircleDisableMinor,
          render: (
            <DefaultCell
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };
    }
  };
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    Object.keys(currentItem).every((x) => currentItem[x] === item[x])
      ? setDisabled(true)
      : setDisabled(false);
  }, [item]);

  const handleSaveClick = async (item) => {
    setIsSaveLoading(true);
    await onSaveMetafield(item);
    setIsSaveLoading(false);
    setDisabled(true);
  };

  return (
    <IndexTable.Row>
      <IndexTable.Cell>
        <Button disabled icon={switchTypeValue(type).icon} />
      </IndexTable.Cell>

      <IndexTable.Cell>
        <TextField disabled min="1" value={namespace} />
      </IndexTable.Cell>

      <IndexTable.Cell>
        <TextField disabled min="1" value={key} />
      </IndexTable.Cell>

      <IndexTable.Cell>{switchTypeValue(type).render}</IndexTable.Cell>

      <IndexTable.Cell>
        <ButtonGroup segmented>
          <Button
            primary
            loading={isSaveLoading}
            disabled={disabled}
            onClick={() => handleSaveClick(item)}
          >
            Save
          </Button>
          <div ref={deleteBtnRef}>
            <Button destructive onClick={() => setOpenConfirmDeleteModal(true)}>
              Delete
            </Button>
          </div>
        </ButtonGroup>
      </IndexTable.Cell>
      <Modal
        activator={deleteBtnRef}
        open={openConfirmDeleteModal}
        onClose={() => setOpenConfirmDeleteModal(false)}
        title="Are you sure to delete this metafield?"
        primaryAction={{
          content: "Confirm",
          loading: isDeleteLoading,
          onAction: async () => {
            setIsDeleteLoading(true);
            await onDeleteMetafield(item.id);
            setIsDeleteLoading(false);
            setOpenConfirmDeleteModal(false);
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setOpenConfirmDeleteModal(false),
          },
        ]}
      ></Modal>
    </IndexTable.Row>
  );
}

export default React.memo(MetafieldRow);
