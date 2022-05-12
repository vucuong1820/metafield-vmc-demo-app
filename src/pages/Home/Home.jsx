import { ResourcePicker } from '@shopify/app-bridge-react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import img from "../../assets/img/emptypage.svg";
function Home(props) {
  const history = useHistory()
  const [open, setOpen] = useState(false);
  
  // const handleSelection = (resources) => {
  //   setOpen(false);
  //   const productPicked = resources.selection[0]
  //   const idProductPicked = productPicked.id.split('/').pop()
  //   history.push(`/product-metafield/${idProductPicked}`)
  // };

  const handleShopAction = () => {
    history.push(`/shop-metafield/`)
  }
  return (
    <Page>
      {/* <ResourcePicker // Resource picker component
        resourceType="Product"
        allowMultiple={false}
        showVariants={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}

      /> */}
      <Layout>
        <EmptyState
          heading="Choose your owner metafields"
          action={{
            content: "Select product",
            // onAction: () => setOpen(true),
            onAction: () => history.push("/product-page")
          }}
          secondaryAction={{
            content: 'Go to shop metafields',
            onAction: handleShopAction,
          }}
          image={img}
          imageContained
        >
          <p>Select products or shop to edit your metafields</p>
        </EmptyState>
      </Layout>
    </Page>)
}

export default Home;