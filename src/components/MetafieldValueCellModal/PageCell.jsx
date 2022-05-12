import {
  Banner,
  Button,
  Icon,
  Modal,
  Page,
  ResourceItem,
  ResourceList,
  TextStyle
} from "@shopify/polaris";
import { PageMajor } from "@shopify/polaris-icons";
import React, { useEffect, useState } from "react";
import useBackendApiClient from "../../api/axiosClient";
PageCell.propTypes = {};

function PageCell({ onSetValue, value }) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [title, setTitle] = useState("");
  const [isError, setIsError] = useState(false);
  const [listPages, setListPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(true);
  const backEndApi = useBackendApiClient();
  useEffect(() => {
    (async () => {
      if (value) {
        const pageId = value.split("/")[value.split("/").length - 1];
        const pageInfo = await backEndApi.get(`/pages/${pageId}`);
        setTitle(pageInfo.data.body.page.title);
      }
      setIsBtnLoading(false);
    })();
  }, [value]);
  useEffect(() => {
    const getApi = async function () {
      try {
        const res = await backEndApi.get("/pages");
        setListPages(
          res.data.body.pages.map((page) => ({
            id: page.admin_graphql_api_id,
            title: page.title,
          }))
        );
        setIsError(false);
        setIsBtnLoading(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsError(true);
        setLoading(false);
        setIsBtnLoading(false);
      }
    };

    getApi();
  }, []);
  const activator = (
    <Button
      loading={isBtnLoading}
      icon={PageMajor}
      fullWidth
      onClick={() => setOpen(true)}
      disclosure="select"
    >
      {title ? title : "Choose page"}
    </Button>
  );

  const renderItem = (item) => {
    const { id, title } = item;
    const media = <Icon source={PageMajor} color="base" />;

    return (
      <ResourceItem
        id={id}
        media={media}
        accessibilityLabel={`View details for ${title}`}
      >
        <h3>
          <TextStyle variation="strong">{title}</TextStyle>
        </h3>
      </ResourceItem>
    );
  };
  return (
    <>
      <Modal
        primaryAction={{
          content: "Select",
          onAction: () => {
            onSetValue(...selectedItems);
            setIsBtnLoading(true);
            setOpen(false);
          },
        }}
        activator={activator}
        open={open}
        title="Select page"
        onClose={() => setOpen(false)}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setOpen(false),
          },
        ]}
      >
        <Modal.Section flush>
          {isError ? (
            <Page>
              <Banner
                title="There's something wrong while fetching list of pages. Please reload this page or try again later !"
                status="warning"
                action={{
                  content: "Reload this page",
                  onAction: () => history.go(0),
                }}
              />
            </Page>
          ) : (
            <ResourceList
              loading={loading}
              resourceName={{ singular: "page", plural: "pages" }}
              items={listPages}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={(value) => {
                const idSelected = value.pop();
                setSelectedItems([idSelected]);
              }}
              selectable
            />
          )}
        </Modal.Section>
      </Modal>
    </>
  );
}

export default React.memo(PageCell);
