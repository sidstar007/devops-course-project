const axios = require('axios');

class UserAPI {
  constructor() {
    this.baseURL = process.env.USER_SERVICE_URL;
  }

  async getUsers() {
    const response = await axios.get(`${this.baseURL}/users`);
    return response.data.map((user) => this.userReducer(user));
  }

  async getUserById(id) {
    const response = await axios.get(`${this.baseURL}/users/${id}`);
    return this.userReducer(response.data);
  }

  async registerUser(input) {
    const response = await axios.post(`${this.baseURL}/users/register`, input);
    const data = response.data;

    return {
      token: data.token,
      user: this.userReducer(data.user),
    };
  }

  async loginUser(input) {
    const response = await axios.post(`${this.baseURL}/users/login`, input);
    const data = response.data;

    return {
      token: data.token,
      user: this.userReducer(data.user),
    };
  }

  userReducer(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    };
  }
}

class ProductAPI {
  constructor() {
    this.baseURL = process.env.PRODUCT_SERVICE_URL;
  }

  async getProducts(token) {
    try {
      const response = await axios.get(`${this.baseURL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.map((product) => this.productReducer(product));
    } catch (error) {
      if (error.response) {
        console.error('Error in getProducts API call:', {
          status: error.response.status,
          data: error.response.data,
        });
      } else {
        console.error('Error in getProducts API call:', error.message);
      }
      throw new Error('Failed to fetch products');
    }
  }

  async getProductById(id) {
    const response = await axios.get(`${this.baseURL}/products/${id}`);
    return this.productReducer(response.data);
  }

  async createProduct(input, token) {
    try {
      const response = await axios.post(`${this.baseURL}/products`, input, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return this.productReducer(response.data);
    } catch (error) {
      // Detailed error logging
      if (error.response) {
        console.error('Error in createProduct API call:', {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error in createProduct API call: No response received', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error in createProduct API call:', error.message);
      }
      throw new Error('Failed to create product');
    }
  }
  async updateProduct(id, input, token) {
    try {
      const response = await axios.put(`${this.baseURL}/products/${id}`, input, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return this.productReducer(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error in updateProduct API call:', {
          status: error.response.status,
          data: error.response.data,
        });
      } else {
        console.error('Error in updateProduct API call:', error.message);
      }
      throw new Error('Failed to update product');
    }
  }
  productReducer(product) {
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    };
  }
}

class OrderAPI {
  constructor() {
    this.baseURL = process.env.ORDER_SERVICE_URL;
  }

  async getOrders(token) {
    const response = await axios.get(`${this.baseURL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map((order) => this.orderReducer(order));
  }

  async getOrderById(id, token) {
    const response = await axios.get(`${this.baseURL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return this.orderReducer(response.data);
  }

  async placeOrder(input, token) {
    const response = await axios.post(`${this.baseURL}/orders`, input, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return this.orderReducer(response.data);
  }

  async updateOrderStatus(id, status, token) {
    try {
      const response = await axios.put(
        `${this.baseURL}/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return this.orderReducer(response.data);
    } catch (error) {
      console.error('Error in updateOrderStatus API call:', error.response ? error.response.data : error.message);
      throw new Error('Failed to update order status');
    }
  }

  orderReducer(order) {
    return {
      id: order._id,
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      shippingAddress: order.shippingAddress,
    };
  }
}

const dataSources = () => ({
  userAPI: new UserAPI(),
  productAPI: new ProductAPI(),
  orderAPI: new OrderAPI(),
});

module.exports = { dataSources };
