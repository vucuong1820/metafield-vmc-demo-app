import React from 'react';
import {Switch, Route, withRouter} from 'react-router'
import {useRoutePropagation} from '@shopify/app-bridge-react';
import Home from '../pages/Home/Home';
import ProductMetafield from '../pages/Product/ProductMetafield';
import ShopMetafield from '../pages/Shop/ShopMetafield';
import { Frame } from '@shopify/polaris';
import ProductPage from '../pages/Product/ProductPage';
function Routes(props) {
  const {location} = props;

  useRoutePropagation(location);

  return (
    <Frame>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/product-metafield/:id" component={ProductMetafield} />
        <Route path="/shop-metafield" component={ShopMetafield} />
        <Route path="/product-page"  component={ProductPage} />
      </Switch>
    </Frame>
  );
}
export default withRouter(Routes);