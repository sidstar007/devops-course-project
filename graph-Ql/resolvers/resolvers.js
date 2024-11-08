const eventPublisher = require('../events/eventPublsihser');

module.exports = {
  Query: {
    users: async (_, __, { dataSources }) => {
      return dataSources.userAPI.getUsers();
    },
    user: async (_, { id }, { dataSources }) => {
      return dataSources.userAPI.getUserById(id);
    },
    products: async (_, __, { dataSources, user }) => {
      // Ensure user is authenticated and pass the token
      if (!user) throw new Error('Authentication required');
      try {
        return await dataSources.productAPI.getProducts(user.token);
      } catch (error) {
        console.error('Failed to fetch products:', error.message);
        throw new Error('Failed to fetch products');
      }
    },
    product: async (_, { id }, { dataSources }) => {
      return dataSources.productAPI.getProductById(id);
    },
    orders: async (_, __, { dataSources, user }) => {
      if (!user) throw new Error('Authentication required');
      return dataSources.orderAPI.getOrders(user.token);
    },
    order: async (_, { id }, { dataSources, user }) => {
      if (!user) throw new Error('Authentication required');
      return dataSources.orderAPI.getOrderById(id, user.token);
    },
  },
  Mutation: {
    registerUser: async (_, { input }, { dataSources }) => {
      return dataSources.userAPI.registerUser(input);
    },
    loginUser: async (_, { input }, { dataSources }) => {
      return dataSources.userAPI.loginUser(input);
    },
    
    createProduct: async (_, { input }, { dataSources, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
  
      if (!user.email) {
        throw new Error('User email is required for authorization');
      }
  
      const adminEmails = 'john.doe@example.com';
      if (!adminEmails.includes(user.email)) {
        throw new Error('Admin access required');
      }
  
      try {
        const product = await dataSources.productAPI.createProduct(input, user.token);
  
        // Log only the necessary product data (not the entire object)
        console.log('Product created:', {
          id: product.id,
          name: product.name,
          quantity: product.quantity,
        });
  
        return product;
      } catch (error) {
        console.error('Failed to create product:', error.message);  
        throw new Error('Failed to create product');
      }
    },
    placeOrder: async (_, { input }, { dataSources, user }) => {
      if (!user) throw new Error('Authentication required');

      const order = await dataSources.orderAPI.placeOrder(input, user.token);

      await eventPublisher.publish('order.placed', {
        orderId: order.id,
        userId: order.userId,
        items: order.items,
      });

      return order;
    },
    // updateProduct: async (_, { id, input }, { dataSources, user }) => {
    //   if (!user) throw new Error('Authentication required');
    //   return dataSources.productAPI.updateProduct(id, input, user.token);
    // },
    
    updateOrderStatus: async (_, { id, status }, { dataSources, user }) => {
      if (!user) throw new Error('Authentication required');

      const order = await dataSources.orderAPI.updateOrderStatus(id, status, user.token);
      return order;
    },
  },
};
