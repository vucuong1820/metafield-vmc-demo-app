import { gql, useMutation } from "@apollo/client";

export const GET_VARIANT_BY_ID = gql`
  query getProductVariant($id: ID!) {
    productVariant(id: $id) {
      id
      displayName
      image {
        url
      }
      title
    }
  }
`;
export const GET_PAGES = gql`
  {
    pages(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;
export const GET_METAFIELD = gql`
  query ProductMetafields($productId: ID!) {
    product(id: $productId) {
      metafields(first: 30, reverse: true) {
        edges {
          node {
            updatedAt
            createdAt
            id
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;
export const GET_FILES = gql`
  {
    files(first: 50, reverse: true) {
      edges {
        node {
          preview {
            image {
              url
            }
          }
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
      }
    }
  }
`;
export const UPDATE_META = gql`
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const GET_LIST_PRODUCTS = gql`
  query getListProducts(
    $first: Int
    $last: Int
    $reverse: Boolean
    $after: String
    $before: String
    $query: String
    $sortKey: ProductSortKeys
  ) {
    products(
      first: $first
      reverse: $reverse
      after: $after
      last: $last
      before: $before
      query: $query
      sortKey: $sortKey
    ) {
      edges {
        node {
          createdAt
          id
          description
          featuredImage {
            url
          }
          title
          handle
          status
          metafields(first: 30) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
      pageInfo {
        startCursor
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`;

export const UPDATE_METAFIELD = gql`
  mutation updateProductMetafields($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        metafields(first: 10) {
          edges {
            node {
              __typename
              id
              namespace
              key
              value
              type
            }
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query getProductById($productId: ID!) {
    product(id: $productId) {
      title
      id
      featuredImage {
        url
      }
    }
  }
`;

export const GET_FILE_BY_ID = gql`
  query getFilesById($id: ID!) {
    node(id: $id) {
      id
      ... on MediaImage {
        alt
        id
        fileStatus
        image {
          url
        }
      }
    }
  }
`;
export const DELETE_METAFIELD = gql`
  mutation metafieldDelete($input: MetafieldDeleteInput!) {
    metafieldDelete(input: $input) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;
export const STAGED_UPLOADS_CREATE = gql`
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// export const UPLOAD_FILES = gql `
// mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
//   stagedUploadsCreate(input: $input) {
//     stagedTargets {
//       # StagedMediaUploadTarget fields
//     }
//     userErrors {
//       field
//       message
//     }
//   }
// }
// `
export const UPLOAD_FILES = gql`
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        createdAt
        fileStatus
        preview {
          image {
            id
            url
          }
        }
        ... on MediaImage {
          id
          image {
            url
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
export const QUERY_FILE_TIME = gql`
  query queryFileByTime($query: String) {
    files(query: $query, first: 10) {
      edges {
        node {
          createdAt
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
      }
    }
  }
`;
export const CREATE_METAFIELD = gql`
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        type
        key
        namespace
        value
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;
export const GET_SHOP_INFO = gql`
  {
    shop {
      name
      id
      url
      metafields(first: 50, reverse:true) {
        edges {
          node {
            updatedAt
            createdAt
            namespace
            key
            value
            id
            type
          }
        }
      }
    }
  }
`;
export const UPDATE_SHOP_METAFIELD = gql`
  mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        key
        namespace
        type
        value
      }
      userErrors {
        code
        message
      }
    }
  }
`;
export const GET_PRODUCT_VENDORS_TAGS = gql`
  {
    shop {
      productVendors(first: 250) {
        edges {
          node
        }
      }
      productTags(first: 250) {
        edges {
          node
        }
      }
    }
  }
`;
// export {updateMetafield, deleteMetafield}
