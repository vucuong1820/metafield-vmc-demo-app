import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Loading } from "@shopify/app-bridge-react";
import {
  Banner,
  Button,
  Card,
  Icon,
  IndexTable,
  Page, Tabs,
  Toast
} from "@shopify/polaris";
import { RefreshMajor } from "@shopify/polaris-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import AddMetafieldModal from "../../components/AddMetafieldModal";
import MetafieldRow from "../../components/MetafieldRow";
import MetafieldsFilter from "../../components/MetafieldsFilter";
import {
  CREATE_METAFIELD,
  DELETE_METAFIELD,
  GET_METAFIELD,
  GET_PRODUCT_BY_ID,
  UPDATE_METAFIELD
} from "../../gql";

function ProductMetafield(props) {
  const history = useHistory()
  const [openModal, setOpenModal] = useState(false);
  const [metafieldsList, setMetafieldsList] = useState([]);
  const [errorsList, setErrorsList] = useState([]);
  const [refreshLoading, setRefreshLoading] = useState(false)
  const [toast, setToast] = useState({
    active: false,
    content: '',
    error: false,
  })
  const [filterList, setFilterList] = useState({
    namespaceList: [],
    typeList: [],
    searchTerm: "",
    sort: ["updatedAt", "DESC"],
  });
  const [namespaceList, setNamespaceList] = useState([])
  const [typeList, setTypeList] = useState([])
  const [isDisabledFilter, setIsDisabledFilter] = useState(true);

  const currentMetafieldList = useRef();
  const productId = `gid://shopify/Product/${props.match.params.id}`;

  const [createMetafield, {}] = useMutation(CREATE_METAFIELD);
  const [updateMetafield, {}] = useMutation(UPDATE_METAFIELD);
  const [deleteMetafield, {}] = useMutation(DELETE_METAFIELD);
  const [getProductInfo] = useLazyQuery(GET_PRODUCT_BY_ID);
  const [productInfo, setProductInfo] = useState({})
  const metafields = useQuery(GET_METAFIELD, {
    variables: { productId }
  });
  
  useEffect(() => {
    (async () => {
      const productData = await getProductInfo({
        variables: { productId }
      })     
      if(!productData.loading) {
        setProductInfo(productData)
      }

    })()
  }, [])


  useEffect(() => {
   
    if (!metafields.loading && !!metafields.data) {
      const metafieldsListData =
        metafields.data &&
        metafields.data?.product.metafields.edges.map((item) => item.node);
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

    }
  }, [
    metafields.loading,
    metafields.data,
    filterList
  ]);

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

  const handleDeleteMetafield = useCallback(async (id) => {
    try {
      const data = await deleteMetafield({
        variables: {
          input: {
            id,
          },
        },
      });
      if(data.data.metafieldDelete.userErrors.length > 0){
        setToast({active: true, content:data.data.metafieldDelete.userErrors[0].message, error: true })
        return
      }
      await metafields.refetch();
      // console.log("Delete successfully");
      setToast({active: true, content: "Delete metafield sucessfully!", error: false})
    } catch (error) {
      setToast({active: true, content: "Failed to delete metafield. Please try again later or reload this page!", error: true })
      console.log("Failed to delete:", error);
    }
  }, []);

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

  const handleAddMetafield = useCallback(async (dataObj) => {
    try {
      // console.log("add metafield, data send:", dataObj);
      const data = await createMetafield({
        variables: {
          metafields: [dataObj],
        },
      });
      if(data.data.metafieldsSet.userErrors.length > 0) {
        setErrorsList(data.data.metafieldsSet.userErrors.map(item => ({
          field: item.field[2],
          message: item.message
        })))
        setToast({active: true, content:data.data.metafieldsSet.userErrors[0].message, error: true })
        return "failed";
      }
      // setSkipMeta(false)     
      await metafields.refetch();
      setToast({active: true, content:'Add new metafield successfully', error: false })
      setErrorsList([])
      return "success";
    } catch (error) {
      setToast({active: true, content:'Failed to add new metafield. Please try again later or reload this page!', error: true })
      console.log("failed to add new metafield:", error);
      return "failed";
    }
}, []);

  const handleSaveMetafield = useCallback(async (item) => {
    try {
      // console.log("start to save");
      let cloneItem = {}
      if (item.type === "date_time") {
        cloneItem = {
          ...item,
          value: `${item.value}:00+00:00`
        }
        delete cloneItem.__typename;
        delete cloneItem.createdAt;
        delete cloneItem.updatedAt;
       
      }else {
        cloneItem = { ...item };
        delete cloneItem.__typename;
        delete cloneItem.createdAt;
        delete cloneItem.updatedAt;
      }
      // console.log("data send:", cloneItem);
      const data = await updateMetafield({
        variables: {
          input: {
            metafields: [
              {
                ...cloneItem,
              },
            ],
            id: productId,
          },
        },
      });
      // console.log(data)
      if(data.data.productUpdate.userErrors.length > 0) {
        setErrorsList(data.data.productUpdate.userErrors.map(item => ({
          id: cloneItem.id ,
          field: item.field[2],
          message: item.message
        })))
        setToast({active: true, content:data.data.productUpdate.userErrors[0].message, error: true})
        return;
      }
      // console.log(data)
      const {id, key, namespace, type, value} = data.data.productUpdate.product.metafields.edges[0].node
      const indexOfMetafieldUpdated = currentMetafieldList.current.findIndex(x => x.id === id)
      currentMetafieldList.current[indexOfMetafieldUpdated] = {id, key, namespace, type, value};
      setMetafieldsList(prev => {
        const index = prev.findIndex(x => x.id === id )
        prev[index] = {id, key, namespace, type, value}
        return prev
      })
      setErrorsList([])
      setToast({active: true, content: "Metafield saved!", error: false})
      return;
    } catch (error) {
      setToast({active: true, content: "Failed to save metafield. Please try again later or reload this page!", error: true})
      console.log("Failed to update:", error);
      return;
    }
  }, [])

  if (productInfo.loading || metafields.loading) return <Loading />;
  return (
    <Page
      breadcrumbs={[{content:'Back', onAction: () => history.push("/product-page")}]}
      title={productInfo.data?.product.title}
      subtitle="Add/Edit/Remove metafields"
      primaryAction={
        <Button primary onClick={() => {
          setOpenModal(!openModal);
          setErrorsList([])
        }} >
          Create metafields
        </Button>
      }
      // secondaryActions={[
      //   {
      //     loading: refreshLoading,
      //     content: "Refresh",
      //     accessibilityLabel: "Refresh list",
      //     onAction: async () => {
      //       setRefreshLoading(true)
      //       await metafields.refetch();
      //       setRefreshLoading(false)
      //       setToast({active: true, content: "Refreshed!", error: false})
      //     },
      //     icon: () => <Icon source={RefreshMajor} color="base" />,
      //   },
      // ]}
    >
      <AddMetafieldModal
        errorsList={errorsList}
        ownerId={productId}
        openModal={openModal}
        setOpenModal={setOpenModal}
        onAddMetafield={handleAddMetafield}
        setErrorsList={setErrorsList}
      />
      <Card>
        <Tabs
          tabs={[
            {
              id: "product-metafields",
              content: `Product ${productInfo.data?.product.title} Metafields`,
              accessibilityLabel: "Product",
              panelID: "product-metafields",
            },
          ]}
          selected={0}
          onSelect={() => console.log("123")}
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
                    error={errorsList.find(x => x.id === metafield.id)}
                    setErrorsList={setErrorsList}
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
          duration="2500"
          onDismiss={() => setToast({active: false, content:'', error: false})}
        />
      ) : null}
    </Page>
  );
}

export default React.memo(ProductMetafield);
