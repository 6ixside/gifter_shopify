import { EmptyState, Layout, Page } from '@shopify/polaris';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Index = () => (
  <Page
    primaryAction={{
      content: 'Select products',
    }}
  >

  	<Layout>
	    <EmptyState
        heading="Welcome to Shopify Gifter"
        action={{
          content: 'Setup Gifter',
          onAction: () => console.log('clicked'),
        }}
        image={img}
      >
        <p>Setup your business with Gifter for Shopify to start.</p>
      </EmptyState>
	  </Layout>
  </Page>
);

export default Index;