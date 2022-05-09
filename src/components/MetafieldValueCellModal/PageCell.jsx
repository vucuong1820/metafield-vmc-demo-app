import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@shopify/polaris';
import { GET_PAGES } from '../../gql';
import { useQuery } from '@apollo/client';

PageCell.propTypes = {
    
};

function PageCell(props) {
    const [open, setOpen] = useState(false)
    const [skip, setSkip] = useState(false)
    // const {data, loading, error} = useQuery(GET_PAGES, {skip})
    const [listPages, setListPages] = useState([])

    // useEffect(() => {
    //     if(!loading && !!data) {
    //         setSkip(false)
    //         console.log(data)
    //         // setListPages()
    //     }
    // }, [data, loading])
    // console.log(data,loading, error)
    const activator = <Button onClick={() => setOpen(true)}>Open</Button>;
    return (
        <Modal
        activator={activator}
        title="Selec a page for metafield"
        open={open}
        onClose={() => setOpen(false)}
        primaryAction={{
            content: 'Add',
            onAction: () => console.log('123'),
          }}
        >
            <Modal.Section>
                Page
            </Modal.Section>

        </Modal>
    );
}

export default PageCell;