// GraphQL documents for the Shopify Storefront API.
// Docs: https://shopify.dev/docs/api/storefront

const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    title
    vendor
    productType
    description
    descriptionHtml
    availableForSale
    tags
    updatedAt
    options {
      id
      name
      optionValues {
        name
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      maxVariantPrice { amount currencyCode }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }
      }
    }
    featuredImage { ...image }
    images(first: 12) {
      edges { node { ...image } }
    }
    seo { title description }
    notesTop: metafield(namespace: "custom", key: "top_notes") { value }
    notesHeart: metafield(namespace: "custom", key: "heart_notes") { value }
    notesBase: metafield(namespace: "custom", key: "base_notes") { value }
    gender: metafield(namespace: "custom", key: "gender") { value }
    scentFamily: metafield(namespace: "custom", key: "scent_family") { value }
    longevity: metafield(namespace: "custom", key: "longevity") { value }
    sillage: metafield(namespace: "custom", key: "sillage") { value }
    season: metafield(namespace: "custom", key: "season") { value }
    timeOfDay: metafield(namespace: "custom", key: "time_of_day") { value }
  }
  ${imageFragment}
`;

const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions { name value }
              price { amount currencyCode }
              product {
                handle
                title
                vendor
                featuredImage { ...image }
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!, $language: LanguageCode) @inContext(language: $language) {
    product(handle: $handle) { ...product }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($query: String, $sortKey: ProductSortKeys, $reverse: Boolean, $first: Int!, $language: LanguageCode) @inContext(language: $language) {
    products(query: $query, sortKey: $sortKey, reverse: $reverse, first: $first) {
      edges { node { ...product } }
    }
  }
  ${productFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!, $language: LanguageCode) @inContext(language: $language) {
    collection(handle: $handle) {
      handle
      title
      description
      updatedAt
      seo { title description }
    }
  }
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int!
    $language: LanguageCode
  ) @inContext(language: $language) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: $first) {
        edges { node { ...product } }
      }
    }
  }
  ${productFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections($language: LanguageCode) @inContext(language: $language) {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          handle
          title
          description
          updatedAt
          seo { title description }
        }
      }
    }
  }
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!, $language: LanguageCode) @inContext(language: $language) {
    productRecommendations(productId: $productId) { ...product }
  }
  ${productFragment}
`;

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) { ...cart }
  }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const updateCartMutation = /* GraphQL */ `
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;
