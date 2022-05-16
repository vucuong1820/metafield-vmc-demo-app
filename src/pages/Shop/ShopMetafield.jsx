import { useMutation, useQuery } from "@apollo/client";
import { Loading } from "@shopify/app-bridge-react";
import {
  Banner,
  Button,
  Card,
  Icon,
  IndexTable,
  Page,
  Tabs, Toast
} from "@shopify/polaris";
import { RefreshMajor } from "@shopify/polaris-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import AddMetafieldModal from "../../components/AddMetafieldModal";
import MetafieldRow from "../../components/MetafieldRow";
import MetafieldsFilter from "../../components/MetafieldsFilter";
import {
  CREATE_METAFIELD,
  DELETE_METAFIELD,
  GET_SHOP_INFO,
  UPDATE_SHOP_METAFIELD
} from "../../gql";

function ShopMetafield(props) {
  const history = useHistory();
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [metafieldsList, setMetafieldsList] = useState([]);
  const [shopInfo, setShopInfo] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [isDisabledFilter, setIsDisabledFilter] = useState(true);
  const [errorsList, setErrorsList] = useState([]);
  const [namespaceList, setNamespaceList] = useState([])
  const [typeList, setTypeList] = useState([])
  const [toast, setToast] = useState({
    active: false,
    content: "",
    error: false,
  });
  const currentMetafieldList = useRef();
  const { loading, data, refetch } = useQuery(GET_SHOP_INFO);
  const [deleteMetafield, {}] = useMutation(DELETE_METAFIELD);
  const [updateShopMetafield, {}] = useMutation(UPDATE_SHOP_METAFIELD);
  const [createMetafield, {}] = useMutation(CREATE_METAFIELD);
  const [filterList, setFilterList] = useState({
    namespaceList: [],
    typeList: [],
    searchTerm: "",
    sort: ["updatedAt", "DESC"],
  });

  useEffect(() => {
    if (!loading && !!data) {
      // setSkip(true);
      const metafieldsListData =
        data && data?.shop.metafields.edges.map((item) => item.node);
      currentMetafieldList.current = metafieldsListData;
      setNamespaceList([...new Set(metafieldsListData.map(metafield => metafield.namespace))])
      setTypeList([...new Set(metafieldsListData.map(metafield => metafield.type))])
      const newMetafieldsList = metafieldsListData.filter((metafield) => {
        if (
          filterList.namespaceList.length <= 0 &&
          filterList.typeList.length > 0
        )
          return (
            filterList.typeList.includes(metafield.type) &&
            (metafield.value.includes(filterList.searchTerm) ||
              metafield.key.includes(filterList.searchTerm))
          );
        if (
          filterList.namespaceList.length <= 0 &&
          filterList.typeList.length <= 0
        )
          return (
            metafield.value.includes(filterList.searchTerm) ||
            metafield.key.includes(filterList.searchTerm)
          );
        if (
          filterList.namespaceList.length > 0 &&
          filterList.typeList.length <= 0
        )
          return (
            filterList.namespaceList.includes(metafield.namespace) &&
            (metafield.value.includes(filterList.searchTerm) ||
              metafield.key.includes(filterList.searchTerm))
          );
        return (
          filterList.namespaceList.includes(metafield.namespace) &&
          filterList.typeList.includes(metafield.type) &&
          (metafield.value.includes(filterList.searchTerm) ||
            metafield.key.includes(filterList.searchTerm))
        );
      });
      setMetafieldsList(handleSortMetafields(newMetafieldsList,filterList.sort));

      setIsDisabledFilter(false);
      // setMetafieldsList(metafieldsListData);
      setShopInfo({
        id: data.shop.id,
        name: data.shop.name,
        url: data.shop.url,
      });
    }
  }, [loading, data, filterList]);

  const handleSortMetafields = useCallback(
    (metafieldsListNeedToSort, sort) => {
      const metafieldsListClone = [...metafieldsListNeedToSort]
      const fieldSort = sort[0];
      const sortType = sort[1];

      if (fieldSort === "updatedAt" || fieldSort === "createdAt") {
        return metafieldsListClone.sort((first, second) =>
          sortType === "ASC"
            ? new Date(first[fieldSort]).getTime() -
              new Date(second[fieldSort]).getTime()
            : new Date(second[fieldSort]).getTime() -
              new Date(first[fieldSort]).getTime()
        );
      }

      return metafieldsListClone.sort((first, second) => sortType === "DESC" ? second[fieldSort].localeCompare(first[fieldSort]) : first[fieldSort].localeCompare(second[fieldSort]) )

    }, []
  );

  const handleChangeMetafield = (newValue, id) => {
    const metafieldChanged = metafieldsList.find((x) => x.id === id);
    const indexOfMetafieldChanged = metafieldsList.findIndex(
      (x) => x.id === id
    );
    const newMetafieldAfterChanged = { ...metafieldChanged, value: newValue };
    const newMetafieldsList = [...metafieldsList];
    newMetafieldsList[indexOfMetafieldChanged] = newMetafieldAfterChanged;
    setMetafieldsList(newMetafieldsList);
  };

  const handleDeleteMetafield = useCallback(async (id) => {
    try {
      // const newMetafieldsList = metafieldsList.filter((x) => x.id !== id);
      const data = await deleteMetafield({
        variables: {
          input: {
            id,
          },
        },
      });
      if (data.data.metafieldDelete.userErrors.length > 0) {
        setToast({
          active: true,
          content: data.data.metafieldDelete.userErrors[0].message,
          error: true,
        });
        return;
      }
      await refetch();
      // setMetafieldsList(newMetafieldsList);
      // currentMetafieldList.current = newMetafieldsList;
      // console.log("Delete successfully");
      setToast({
        active: true,
        content: "Delete metafield sucessfully!",
        error: false,
      });
    } catch (error) {
      setToast({
        active: true,
        content:
          "Failed to delete metafield. Please try again later or reload this page!",
        error: true,
      });
      console.log("Failed to delete:", error);
    }
  }, []);
  const handleSaveMetafield = useCallback(
    async (item) => {
      try {
        // console.log("start to save");

        let cloneItem = {};
        if (item.type === "date_time") {
          cloneItem = {
            ...item,
            value: `${item.value}:00+00:00`,
          };
          delete cloneItem.__typename;
          delete cloneItem.id;
          delete cloneItem.createdAt;
          delete cloneItem.updatedAt;
        } else {
          cloneItem = { ...item };
          delete cloneItem.__typename;
          delete cloneItem.id;
          delete cloneItem.createdAt;
          delete cloneItem.updatedAt;
        }

        // console.log("data send:", {
        //   ...cloneItem,
        //   ownerId: shopInfo.id,
        // });
        const data = await updateShopMetafield({
          variables: {
            metafields: [
              {
                ...cloneItem,
                ownerId: shopInfo.id,
              },
            ],
          },
        });
        // console.log(data);
        if (data.data.metafieldsSet.userErrors.length > 0) {
          setErrorsList(
            data.data.metafieldsSet.userErrors.map((x) => ({
              id: item.id,
              field: "value",
              message: x.message,
            }))
          );
          setToast({
            active: true,
            content: data.data.metafieldsSet.userErrors[0].message,
            error: true,
          });
          return;
        }
        await refetch();

        setErrorsList([]);
        
        setToast({ active: true, content: "Metafield saved!", error: false });
      } catch (error) {
        setToast({
          active: true,
          content:
            "Failed to save metafield. Please try again later or reload this page!",
          error: true,
        });
        console.log("Failed to update:", error);
      }
    },
    [shopInfo.id]
  );

  const handleAddMetafield = useCallback(async (dataObj) => {
    try {
      // console.log("add metafield, data send:", dataObj);
      const dataAdded = await createMetafield({
        variables: {
          metafields: [dataObj],
        },
      });
      if (dataAdded.data.metafieldsSet.userErrors.length > 0) {
        setErrorsList(
          dataAdded.data.metafieldsSet.userErrors.map((item) => ({
            field: item.field[2],
            message: item.message,
          }))
        );
        setToast({
          active: true,
          content: dataAdded.data.metafieldsSet.userErrors[0].message,
          error: true,
        });
        return "failed";
      }
      await refetch();
      setErrorsList([]);
      setToast({
        active: true,
        content: "Add new metafield successfully",
        error: false,
      });
      return "success";
    } catch (error) {
      setToast({
        active: true,
        content:
          "Failed to add new metafield. Please try again later or reload this page!",
        error: true,
      });
      console.log("failed to add new metafield:", error);
      return "failed";
    }
  }, []);

  if (loading) return <Loading />;
  return (
    //   <div>Shop</div>
    <Page
      breadcrumbs={[{ content: "Back", onAction: () => history.push("/") }]}
      title={shopInfo?.name?.toUpperCase() || ""}
      subtitle="Add/Edit/Remove metafields"
      primaryAction={
        <Button
          primary
          onClick={() => {
            setOpenModal(!openModal);
            setErrorsList([]);
          }}
          c
        >
          Create metafields
        </Button>
      }
      // secondaryActions={[
      //   {
      //     loading: refreshLoading,
      //     content: "Refresh",
      //     accessibilityLabel: "Refresh list",
      //     onAction: async () => {
      //       setRefreshLoading(true);
      //       await refetch();
      //       setRefreshLoading(false);
      //       setToast({ active: true, content: "Refreshed!", error: false });
      //     },
      //     icon: () => <Icon source={RefreshMajor} color="base" />,
      //   },
      // ]}
    >
      <AddMetafieldModal
        setErrorsList={setErrorsList}
        errorsList={errorsList}
        ownerId={shopInfo.id}
        openModal={openModal}
        setOpenModal={setOpenModal}
        onAddMetafield={handleAddMetafield}
        
      />
      <Card>
        <Tabs
          tabs={[
            {
              id: "shop-metafields",
              content: `Shop ${shopInfo?.name?.toUpperCase() || ""} Metafields`,
              accessibilityLabel: "Shop",
              panelID: "shop-metafields",
            },
          ]}
          selected={0}
          onSelect={() => console.log('123')}
        >
          <MetafieldsFilter
            namespaceList={namespaceList}
            typeList={typeList}
            disabled={isDisabledFilter}
            filterList={filterList}
            onChangeFilterList={(newValue) =>  setFilterList(newValue)}
          />
          <Card.Section>
            {metafieldsList.length > 0 ? (
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
                {metafieldsList.map((metafield, index) => {
                  return (
                    <MetafieldRow
                      setErrorsList={setErrorsList}
                      error={errorsList.find((x) => x.id === metafield.id)}
                      key={metafield.id}
                      index={index}
                      currentItem={currentMetafieldList.current.find(
                        (x) => x.id === metafield.id
                      )}
                      item={metafield}
                      onDeleteMetafield={handleDeleteMetafield}
                      onChangeMetafield={handleChangeMetafield}
                      onSaveMetafield={handleSaveMetafield}
                    />
                  );
                })}
              </IndexTable>
            ) : (
              <Banner
                title="Empty metafields"
                action={{
                  content: "Create a new one",
                  onAction: () => {
                    setOpenModal(!openModal);
                    setErrorsList([]);
                  },
                }}
                status="info"
                onDismiss={() => {}}
              >
                <p>You haven't any metafields yet. Create a new one</p>
              </Banner>
            )}
          </Card.Section>
        </Tabs>
      </Card>
      {toast.active ? (
        <Toast
          error={toast.error}
          content={toast.content}
          duration="2000"
          onDismiss={() =>
            setToast({ active: false, content: "", error: false })
          }
        />
      ) : null}
    </Page>
  );
}

export default React.memo(ShopMetafield);
