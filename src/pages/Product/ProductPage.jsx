import { useLazyQuery } from "@apollo/client";
import {
  ActionList, Badge, Button, ButtonGroup, Card, Page, Popover, RadioButton, ResourceList, Stack, Tag, TextStyle,
  Thumbnail
} from "@shopify/polaris";
import { ArrowDownMinor, ArrowUpMinor, ChevronLeftMinor, ChevronRightMinor, SortMinor } from "@shopify/polaris-icons";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GET_LIST_PRODUCTS, GET_PRODUCT_VENDORS_TAGS } from "../../gql";
import "./ProductPage.scss";
function ProductPage() {
  const history = useHistory();
  const [vendorActive, setVendorActive] = useState(false);
  const [tagActive, setTagActive] = useState(false);
  const [statusActive, setStatusActive] = useState(false);
  const [sortActive, setSortAcitve] = useState(false);
  const [getListProducts] = useLazyQuery(GET_LIST_PRODUCTS);
  const [productVendors, setProductVendors] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [getListProductVendors] = useLazyQuery(GET_PRODUCT_VENDORS_TAGS);
  const [query, setQuery] = useState({});
  const [filtersProductsList, setFiltersProductsList] = useState({
    last: null,
    before: null,
    first: 10,
    reverse: true,
    after: null,
    query: null,
    sortKey: null,
  });

  const [sortValue, setSortValue] = useState("");
  const handleChange = useCallback((_checked, newValue) => {
    setSortValue(newValue);
    setFiltersProductsList((prev) => ({ ...prev, sortKey: newValue }));
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [listProducts, setListProducts] = useState([]);
  const [cursor, setCursor] = useState({
    endCursor: "",
    hasPreviousPage: false,
    hasNextPage: false,
    startCursor: "",
  });
  const queryValue = React.useMemo(() => {
    let result = "";
    for (const key in query) {
      if (key === "title") {
        result = result + ` AND (${key}:${query[key]}*)`;
      } else {
        result = result + ` AND (${key}:${query[key]})`;
      }
    }
    return result;
  }, [query]);
  const sortKeys = React.useMemo(
    () => [
      "TITLE",
      "PRODUCT_TYPE",
      "VENDOR",
      "INVENTORY_TOTAL",
      "UPDATED_AT",
      "CREATED_AT",
    ],
    []
  );
  useEffect(() => {
    (async () => {
      try {
        const data = await getListProductVendors();
        setProductVendors(data.data.shop.productVendors.edges);
        setProductTags(data.data.shop.productTags.edges);
      } catch (error) {
        console.log("error:", error);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data = await getListProducts({
        variables: { ...filtersProductsList, query: queryValue },
      });

      setListProducts(data.data.products.edges.map((item) => item.node));
      setCursor({ ...data.data.products.pageInfo });
      setIsLoading(false);
    })();
  }, [filtersProductsList, queryValue]);

  const handleChangeSearchValue = debounce((value) => {
    setQuery((prev) => ({ ...prev, title: value }));
    setFiltersProductsList((prev) => ({
      ...prev,
      last: null,
      before: null,
      first: 10,
      after: null,
    }));
  }, 500);

  const vendorActivator = (
    <Button disclosure="down" onClick={() => setVendorActive((prev) => !prev)}>
      Product vendor
    </Button>
  );
  const tagActivator = (
    <Button disclosure="down" onClick={() => setTagActive((prev) => !prev)}>
      Tags
    </Button>
  );
  const statusActivator = (
    <Button disclosure="down" onClick={() => setStatusActive((prev) => !prev)}>
      Status
    </Button>
  );
  const sortActivator = (
    <Button icon={SortMinor} onClick={() => setSortAcitve((prev) => !prev)}>
      Sort
    </Button>
  );
  const handleChangeVendor = (vendor) => {
    setVendorActive(false);
    setQuery((prev) => ({
      ...prev,
      vendor,
    }));
    setFiltersProductsList(prev => ({
      ...prev,
      last: null,
      before: null,
      first: 10,
      after: null,
    }))
  };
  const handleChangeTag = (tag) => {
    setTagActive(false);
    setQuery((prev) => ({
      ...prev,
      tag: tag,
    }));
    setFiltersProductsList(prev => ({
      ...prev,
      last: null,
      before: null,
      first: 10,
      after: null,
    }))
  };
  const handleChangeStatus = (status) => {
    setStatusActive(false);
    setQuery((prev) => ({
      ...prev,
      status,
    }));
    setFiltersProductsList(prev => ({
      ...prev,
      last: null,
      before: null,
      first: 10,
      after: null,
    }))
  };
  return (
    <Page
      breadcrumbs={[{ onAction: () => history.push("/") }]}
      title="Products"
    >
      <div style={{ height: "568px" }}>
        <Card>
          <ResourceList
            loading={isLoading}
            resourceName={{ singular: "customer", plural: "customers" }}
            filterControl={
              <>
                <div className="filter-wrapper">
                  <input
                    className="input-search"
                    onChange={(e) => handleChangeSearchValue(e.target.value)}
                  />
                  <ButtonGroup segmented>
                    <Popover
                      active={vendorActive}
                      activator={vendorActivator}
                      autofocusTarget="first-node"
                      onClose={() => setVendorActive(false)}
                    >
                      <ActionList
                        actionRole="product-vendor"
                        items={productVendors.map((vendor) => ({
                          content: vendor.node,
                          onAction: () => handleChangeVendor(vendor.node),
                        }))}
                      />
                    </Popover>
                    <Popover
                      active={tagActive}
                      activator={tagActivator}
                      autofocusTarget="first-node"
                      onClose={() => setTagActive(false)}
                    >
                      <ActionList
                        actionRole="product-vendor"
                        items={productTags.map((tag) => ({
                          content: tag.node,
                          onAction: () => handleChangeTag(tag.node),
                        }))}
                      />
                    </Popover>
                    <Popover
                      active={statusActive}
                      activator={statusActivator}
                      autofocusTarget="product-status"
                      onClose={() => setStatusActive(false)}
                    >
                      <ActionList
                        actionRole="product-status"
                        items={["Active", "Archived", "Draft"].map(
                          (status) => ({
                            content: status,
                            onAction: () => handleChangeStatus(status),
                          })
                        )}
                      />
                    </Popover>
                    <Popover
                      active={sortActive}
                      activator={sortActivator}
                      autofocusTarget="product-sort"
                      onClose={() => setSortAcitve(false)}
                    >
                      <Popover.Section>
                        <Stack vertical>
                          <Stack.Item>
                            <TextStyle variation="subdued">Sort by</TextStyle>
                          </Stack.Item>
                          {sortKeys.map((item, index) => (
                            <Stack.Item key={index}>
                              <RadioButton
                                label={item}
                                checked={sortValue === item}
                                id={item}
                                name={item}
                                onChange={handleChange}
                              />
                            </Stack.Item>
                          ))}
                        </Stack>
                      </Popover.Section>
                      <ActionList
                        actionRole="product-status"
                        items={[
                          {
                            active: filtersProductsList.reverse === true,
                            content: "DESC",
                            icon: ArrowDownMinor,
                            onAction: () =>
                              setFiltersProductsList((prev) => ({
                                ...prev,
                                first: 10,
                                after: null,
                                reverse: true,
                              })),
                          },
                          {
                            active: filtersProductsList.reverse === false,
                            content: "ASC",
                            icon: ArrowUpMinor,
                            onAction: () =>
                              setFiltersProductsList((prev) => ({
                                ...prev,
                                first: 10,
                                after: null,
                                last: null,
                                reverse: false,
                                before: null,
                              })),
                          },
                        ]}
                      />
                    </Popover>
                  </ButtonGroup>
                </div>
                <div className="filter-tags">
                  {query?.vendor && (
                    <Tag
                      key={query?.vendor}
                      onRemove={() =>
                        setQuery((prev) => {
                          const newQuery = { ...query };
                          delete newQuery["vendor"];
                          return newQuery;
                        })
                      }
                      disabled={false}
                    >
                      {query?.vendor}
                    </Tag>
                  )}
                  {query?.tag && (
                    <Tag
                      key={query?.tag}
                      onRemove={() =>
                        setQuery((prev) => {
                          const newQuery = { ...query };
                          delete newQuery["tag"];
                          return newQuery;
                        })
                      }
                      disabled={false}
                    >
                      {query?.tag}
                    </Tag>
                  )}
                  {query?.status && (
                    <Tag
                      key={query?.status}
                      onRemove={() =>
                        setQuery((prev) => {
                          const newQuery = { ...query };
                          delete newQuery["status"];
                          return newQuery;
                        })
                      }
                      disabled={false}
                    >
                      {query?.status}
                    </Tag>
                  )}
                </div>
              </>
            }
            items={listProducts}
            renderItem={(item) => {
              const {
                title,
                id,
                description,
                status,
                featuredImage,
                metafields,
              } = item;
              const media = (
                <Thumbnail
                  source={
                    featuredImage?.url ||
                    "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640"
                  }
                />
              );
              return (
                <ResourceList.Item
                  onClick={() => {
                    const idProductPicked = id.split("/").pop();
                    history.push(`/product-metafield/${idProductPicked}`);
                  }}
                  id={id}
                  media={media}
                  accessibilityLabel={`View details for ${title}`}
                >
                  <div className="product-wrapper">
                    <div>
                      <h3>
                        <TextStyle variation="strong">{title}</TextStyle>
                      </h3>
                      <div>{description}</div>
                    </div>
                    <div className="badges">
                      <div className="badges__item badges__item--status">
                        <Badge status="success">{`${status[0]}${status
                          .slice(1)
                          .toLowerCase()}`}</Badge>
                      </div>
                      <div className="badges__item">
                        <Badge status={metafields.edges.length > 0 ? "success": ""}>
                          {metafields.edges.length > 0
                            ? `${metafields.edges.length} metafields`
                            : "No metafields"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </ResourceList.Item>
              );
            }}
          />
        </Card>
        <div className="pagination">
          <ButtonGroup>
            <Button
              disabled={!cursor.hasPreviousPage}
              icon={ChevronLeftMinor}
              onClick={() => {
                setFiltersProductsList(prev => ({
                  ...prev,
                  first: null,
                  after: null,
                  last: 10,
                  before: cursor.startCursor,
                }));
              }}
            ></Button>
            <Button
              disabled={!cursor.hasNextPage}
              icon={ChevronRightMinor}
              onClick={() => {
                setFiltersProductsList(prev => ({
                  ...prev,
                  last: null,
                  before: null,
                  first: 10,
                  after: cursor.endCursor,
                }));
              }}
            ></Button>
          </ButtonGroup>
        </div>
      </div>
    </Page>
  );
}

export default React.memo(ProductPage);
