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
} from "@shopify/polaris-icons";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import BooleanCellModal from "./MetafieldValueCellModal/BooleanCellModal";
import ColorCellModal from "./MetafieldValueCellModal/ColorCellModal";
import DateCellModal from "./MetafieldValueCellModal/DateCellModal";
import DateTimeCell from "./MetafieldValueCellModal/DateTimeCell";
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

MetafieldRow.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.object,
  // onChangeMetafields: PropTypes.func,
};

function MetafieldRow(props) {
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const {
    item = {},
    onChangeMetafield,
    onDeleteMetafield,
    currentItem,
    onSaveMetafield,
    error,
    setErrorsList
  } = props;
  const deleteBtnRef = useRef(null);
  const { namespace, key, value, type, id } = item;
  const handleValue = (newValue) => {
    onChangeMetafield(newValue, id);
    // const newErrorsList = [...errorsList];
    // const indexFieldChanged = errorsList.findIndex(
    //   (x) => x.field === "value"
    // );
    // if (newErrorsList[indexFieldChanged]?.message) {
    //   newErrorsList[indexFieldChanged].message = "";
    //   setErrorsList(newErrorsList);
    // }
    setErrorsList(prev => {
      const index = prev.findIndex(x => x.id === id)
      if(prev[index]?.message){
        prev[index].message = '';
      }
      return prev
    })
  };
  const switchTypeValue = (type) => {
    switch (type) {
      case "single_line_text_field":
        return {
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
          icon: CodeMajor,
          render: (
            <JsonCell
              onSetValue={handleValue}
              value={value}
              error={error?.message || false}
            />
          ),
        };

      // case "page_reference":
      //   return {
      //     icon: PageMajor,
      //     render: <PageCell onSetValue={handleValue} value={value} />,
      //   };

      default:
        break;
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
