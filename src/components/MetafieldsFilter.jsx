import {
  ActionList, Button,
  ButtonGroup,
  Card, ChoiceList, Icon, Popover, RadioButton, Stack, Tag, TextField, TextStyle
} from "@shopify/polaris";
import {
  ArrowDownMinor,
  ArrowUpMinor, SearchMinor
} from "@shopify/polaris-icons";
import React, { useCallback, useState } from "react";

MetafieldsFilter.propTypes = {};

function MetafieldsFilter({
  filterList,
  onChangeFilterList,
  disabled,
  typeList,
  namespaceList,
}) {
  const [popoverNamespaceActive, setPopoverNamespaceActive] = useState(false);
  const [popoverTypeActive, setPopoverTypeActive] = useState(false);
  const [popoverSortActive, setPopoverSortActive] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const sortKeys = React.useMemo(
    () => [
      {
        label: "Key",
        value: "key",
      },
      {
        label: "Namespace",
        value: "namespace",
      },
      {
        label: "Created",
        value: "createdAt",
      },
      {
        label: "Updated",
        value: "updatedAt",
      },
    ],
    []
  );
  const getContentSortType = useCallback((sortType) => {
    switch (sortType) {
      case "key":
      case "namespace":
        return {
          desc: "Z-A",
          asc: "A-Z",
        };
      case "createdAt":
      case "updatedAt":
        return {
          desc: "Newest to Oldest",
          asc: "Oldest to Newest",
        };
      default:
        break;
    }
  }, []);

  const getTypeLabel = useCallback((type) => {
    switch (type) {
      case "single_line_text_field":
        return "Single Line Text";
      case "multi_line_text_field":
        return "Multi line text";
      case "boolean":
        return "Boolean";
      case "color":
        return "Color";
      case "date":
        return "Date";
      case "date_time":
        return "Date and time";
      case "number_decimal":
        return "Decimal";
      case "number_integer":
        return "Integer";
      case "dimension":
        return "Dimension";
      case "product_reference":
        return "Product";
      case "file_reference":
        return "File";
      case "variant_reference":
        return "Variant";
      case "rating":
        return "Rating";
      case "volume":
        return "Volume";
      case "weight":
        return "Weight";
      case "url":
        return "URL";
      case "json":
        return "JSON String";
      case "page_reference":
        return "Page";
      case "string":
        return "String (Old)";
      case "json_string":
        return "JSON String (Old)";
      case "integer":
        return "Integer (Old)";
      default:
        return "Not Found";
    }
  }, []);
  const togglePopoverNamespaceActive = useCallback(
    () => setPopoverNamespaceActive((prev) => !prev),
    []
  );
  const togglePopoverTypeActive = useCallback(
    () => setPopoverTypeActive((prev) => !prev),
    []
  );
  const togglePopoverSortActive = useCallback(
    () => setPopoverSortActive((prev) => !prev),
    []
  );
  const handleChangeSortField = useCallback((_checked, newValue) => {
    setSortField(newValue);
    const newFilterList = { ...filterList };
    newFilterList.sort[0] = newValue;
    onChangeFilterList(newFilterList);
  }, []);
  const namespaceActivator = (
    <Button
      disabled={disabled}
      onClick={togglePopoverNamespaceActive}
      disclosure="down"
    >
      Namespace
    </Button>
  );
  const typeActivator = (
    <Button
      disabled={disabled}
      onClick={togglePopoverTypeActive}
      disclosure="down"
    >
      Type
    </Button>
  );

  const sortActivator = (
    <Button
      onClick={togglePopoverSortActive}
      disabled={disabled}
      disclosure="select"
    >
      Sort
    </Button>
  );
  return (
    <Card.Section disabled={disabled}>
      <div className="filter-wrapper">
        <TextField
          disabled={disabled}
          value={filterList.searchTerm}
          onChange={(value) =>
            onChangeFilterList({
              ...filterList,
              searchTerm: value,
            })
          }
          clearButton
          autoComplete="off"
          onClearButtonClick={() =>
            onChangeFilterList({
              ...filterList,
              searchTerm: "",
            })
          }
          prefix={<Icon source={SearchMinor} color="base" />}
          fullWidth
          placeholder="Search metafields by key or value"
        />
        <ButtonGroup segmented fullWidth>
          <Popover
            active={popoverNamespaceActive}
            activator={namespaceActivator}
            autofocusTarget="metafields-namespace"
            onClose={togglePopoverNamespaceActive}
          >
            <Popover.Section>
              <ChoiceList
                allowMultiple
                choices={namespaceList.map((namespace) => ({
                  label: namespace,
                  value: namespace,
                }))}
                selected={filterList.namespaceList}
                onChange={(value) => {
                  onChangeFilterList({
                    ...filterList,
                    namespaceList: value,
                  });
                }}
              />
              <Button
                plain
                disabled={filterList.namespaceList.length <= 0}
                onClick={() =>
                  onChangeFilterList({ ...filterList, namespaceList: [] })
                }
              >
                Clear
              </Button>
            </Popover.Section>
          </Popover>
          <Popover
            active={popoverTypeActive}
            activator={typeActivator}
            autofocusTarget="metafields-type"
            onClose={togglePopoverTypeActive}
          >
            <Popover.Section>
              <ChoiceList
                allowMultiple
                choices={typeList.map((type) => ({
                  label: getTypeLabel(type),
                  value: type,
                }))}
                selected={filterList.typeList}
                onChange={(value) => {
                  onChangeFilterList({ ...filterList, typeList: value });
                }}
              />
              <Button
                plain
                disabled={filterList.typeList.length <= 0}
                onClick={() =>
                  onChangeFilterList({ ...filterList, typeList: [] })
                }
              >
                Clear
              </Button>
            </Popover.Section>
          </Popover>

          <Popover
            active={popoverSortActive}
            activator={sortActivator}
            autofocusTarget="metafields-sort"
            onClose={togglePopoverSortActive}
            preferredAlignment="right"
          >
            <Popover.Section>
              <Stack vertical>
                <Stack.Item>
                  <TextStyle variation="subdued">Sort by</TextStyle>
                </Stack.Item>
                {sortKeys.map((item, index) => (
                  <Stack.Item key={index}>
                    <RadioButton
                      label={item.label}
                      checked={item.value === sortField}
                      id={item.value}
                      name={item.value}
                      onChange={handleChangeSortField}
                    />
                  </Stack.Item>
                ))}
              </Stack>
            </Popover.Section>
            <ActionList
              actionRole="product-status"
              items={[
                {
                  active: filterList.sort[1] === "DESC",
                  // active: filtersProductsList.reverse === true,
                  content: getContentSortType(filterList.sort[0]).desc,
                  icon: ArrowDownMinor,
                  onAction: () => {
                    const newFilterList = { ...filterList };
                    newFilterList.sort[1] = "DESC";
                    onChangeFilterList(newFilterList);
                  },
                },
                {
                  active: filterList.sort[1] === "ASC",
                  content: getContentSortType(filterList.sort[0]).asc,
                  icon: ArrowUpMinor,
                  onAction: () => {
                    const newFilterList = { ...filterList };
                    newFilterList.sort[1] = "ASC";
                    onChangeFilterList(newFilterList);
                  },
                },
              ]}
            />
          </Popover>
        </ButtonGroup>
      </div>
      <div className="filter-tags">
        {filterList.namespaceList.length > 0 && (
          <Tag
            // key={}
            onRemove={() =>
              onChangeFilterList({ ...filterList, namespaceList: [] })
            }
            disabled={false}
          >
            Namespace:
            {filterList.namespaceList.map((namespace, index) =>
              index === filterList.namespaceList.length - 1
                ? ` ${namespace}`
                : ` ${namespace},`
            )}
          </Tag>
        )}

        {filterList.typeList.length > 0 && (
          <Tag
            // key={}
            onRemove={() => onChangeFilterList({ ...filterList, typeList: [] })}
            disabled={false}
          >
            Type:
            {filterList.typeList.map((type, index) =>
              index === filterList.typeList.length - 1
                ? ` ${getTypeLabel(type)}`
                : ` ${getTypeLabel(type)},`
            )}
          </Tag>
        )}
      </div>
    </Card.Section>
  );
}

export default MetafieldsFilter;
