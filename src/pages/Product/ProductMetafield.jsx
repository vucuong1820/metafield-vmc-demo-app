import { useMutation, useQuery } from "@apollo/client";
import { Loading } from "@shopify/app-bridge-react";
import { useHistory } from 'react-router-dom';
import { Modal } from "@shopify/app-bridge/actions";
import {
  Button,
  Card,
  Icon,
  IndexTable,
  Page,
  Tabs,
  Toast,
} from "@shopify/polaris";
import { ViewMajor } from "@shopify/polaris-icons";
import React, { useEffect, useRef, useState } from "react";
import AddMetafieldModal from "../../components/AddMetafieldModal";
import MetafieldRow from "../../components/MetafieldRow";
import {
  CREATE_METAFIELD,
  DELETE_METAFIELD,
  GET_METAFIELD,
  GET_PRODUCT_BY_ID,
  UPDATE_METAFIELD,
} from "../../gql";

function ProductMetafield(props) {
  const history = useHistory()
  const [skipProduct, setSkipProduct] = useState(false);
  const [skipMeta, setSkipMeta] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [metafieldsList, setMetafieldsList] = useState([]);
  const [errorsList, setErrorsList] = useState([]);
  const [toast, setToast] = useState({
    active: false,
    content: '',
    error: false,
  })


  const currentMetafieldList = useRef();
  const productId = `gid://shopify/Product/${props.match.params.id}`;

  const [createMetafield, {}] = useMutation(CREATE_METAFIELD);
  const [updateMetafield, {}] = useMutation(UPDATE_METAFIELD);
  const [deleteMetafield, {}] = useMutation(DELETE_METAFIELD);
  const productInfo = useQuery(GET_PRODUCT_BY_ID, {
    variables: { productId },
    skipProduct,
  });
  const metafields = useQuery(GET_METAFIELD, {
    variables: { productId },
    skipMeta,
  });

  useEffect(() => {
    if (!productInfo.loading && !!productInfo.data) {
      setSkipProduct(true);
    }
    if (!metafields.loading && !!metafields.data) {
      setSkipMeta(true);
      const metafieldsListData =
        metafields.data &&
        metafields.data?.product.metafields.edges.map((item) => item.node);
      currentMetafieldList.current = metafieldsListData;
      setMetafieldsList(metafieldsListData);
    }
  }, [
    productInfo.loading,
    productInfo.data,
    metafields.loading,
    metafields.data,
  ]);
  const handleDeleteMetafield = async (id) => {
    try {
      const newMetafieldsList = metafieldsList.filter((x) => x.id !== id);
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
      setMetafieldsList(newMetafieldsList);
      console.log("Delete successfully");
    } catch (error) {
      setToast({active: true, content: "Failed to delete metafield. Please try again!", error: true })
      console.log("Failed to delete:", error);
    }
  };
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

  const handleAddMetafield = async (dataObj) => {
    try {
      console.log("add metafield, data send:", dataObj);
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

      await metafields.refetch();
      setToast({active: true, content:'Add new metafield successfully', error: false })
      setErrorsList([])
      return "success";
    } catch (error) {
      setToast({active: true, content:'Failed to add new metafield. Please try again!', error: true })
      console.log("failed to add new metafield:", error);
      return "failed";
    }
  };

  const handleSaveMetafield = async (item) => {
    try {
      console.log("start to save");
      const cloneItem = { ...item };
      delete cloneItem.__typename;
      console.log("data send:", cloneItem);
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
      console.log(data)
      if(data.data.productUpdate.userErrors.length > 0) {
        setErrorsList(data.data.productUpdate.userErrors.map(item => ({
          id: cloneItem.id ,
          field: item.field[2],
          message: item.message
        })))
        setToast({active: true, content:data.data.productUpdate.userErrors[0].message, error: true})
        return;
      }
      console.log(data)
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
      // setErrorsList([]);
      return;
    } catch (error) {
      setToast({active: true, content: "Failed to save metafield. Please try again!", error: true})
      console.log("Failed to update:", error);
      return;
    }
  };

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
          Create meta fields
        </Button>
      }
      secondaryActions={[
        {
          content: "Preview",
          accessibilityLabel: "Preview product",
          onAction: () => alert("Preview product"),
          icon: () => <Icon source={ViewMajor} color="base" />,
        },
      ]}
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
          <Card.Section>
            <IndexTable
              resourceName={{ singular: "metafield", plural: "metafields" }}
              itemCount={3}
              headings={[
                { title: "Namespace" },
                { title: "Key" },
                { title: "Value" },
                { title: "Actions" },
              ]}
              selectable={false}
            >
              {metafields &&
                metafieldsList.map((metafield, index) => {
                  return (
                    <MetafieldRow
                      error={errorsList.find(x => x.id === metafield.id)}
                      setErrorsList={setErrorsList}
                      key={index}
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
          </Card.Section>
        </Tabs>
      </Card>
      {toast.active ? (
        <Toast
          error={toast.error}
          content={toast.content}
          duration="4000"
          onDismiss={() => setToast({active: false, content:'', error: false})}
        />
      ) : null}
    </Page>
  );
}

export default React.memo(ProductMetafield);
