import axios from "axios";
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';

const config = {
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
};
/*
this is custom hook that fetch data from my backend
*/
 const useBackendApiClient = () => {
	const app = useAppBridge();
  const instance = axios.create();
  instance.interceptors.request.use(function (config) {

    return getSessionToken(app) // requires a Shopify App Bridge instance
      .then((token) => {
        // Append your request headers with an authenticated token
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
  });
	return instance;
};
export default useBackendApiClient;