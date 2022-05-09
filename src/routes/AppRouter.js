import {withRouter} from 'react-router'
import {useClientRouting} from '@shopify/app-bridge-react';
//Setup with the ClientRouter hook
function AppRouter(props) {
    const {history} = props;
    useClientRouting(history);
    return null;
}

export default withRouter(AppRouter);