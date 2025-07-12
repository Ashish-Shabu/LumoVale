# Ecommerce Website

A full-stack ecommerce web application built with Node.js, Express.js, MongoDB, and Handlebars templating engine. This application provides a complete online shopping experience with user authentication, product management, shopping cart functionality, and payment integration.

## 🚀 Features

### User Features
- **User Authentication**: Sign up, login, and logout functionality
- **Product Browsing**: View all available products with details
- **Shopping Cart**: Add products to cart, manage quantities, and view cart
- **Order Management**: Place orders and view order history
- **Payment Integration**: Support for both Cash on Delivery and Razorpay payment gateway
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Image Upload**: Upload product images with automatic file handling
- **Admin Dashboard**: Manage all products from a centralized admin panel

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: Handlebars (HBS)
- **Authentication**: Express Session, bcrypt for password hashing
- **Payment Gateway**: Razorpay integration
- **File Upload**: Express-fileupload for image handling
- **Styling**: CSS (static files in public directory)

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URL=mongodb://localhost:27017/ecommerce
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key
   ```

4. **Start MongoDB**
   ```bash
   npm run start-mongo
   ```
   Or start MongoDB manually if you have it installed globally.

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - User Interface: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`

## 📁 Project Structure

```
ecommerce-website/
├── bin/
│   └── www                 # Application entry point
├── config/                 # Configuration files
├── helpers/                # Helper functions
│   ├── product-helpers.js  # Product-related operations
│   └── user-helpers.js     # User-related operations
├── models/                 # Database models
│   ├── Cart.js            # Shopping cart model
│   ├── Order.js           # Order model
│   ├── Product.js         # Product model
│   └── User.js            # User model
├── public/                 # Static files (CSS, JS, images)
│   └── product-images/     # Product images storage
├── routes/                 # Route handlers
│   ├── admin.js           # Admin routes
│   └── user.js            # User routes
├── views/                  # Handlebars templates
│   ├── admin/             # Admin panel views
│   ├── layouts/           # Layout templates
│   ├── partials/          # Reusable template parts
│   └── user/              # User interface views
├── app.js                  # Main application file
├── package.json            # Dependencies and scripts
└── README.md              # This file
```



### For Users
1. Visit `http://localhost:3000`
2. Sign up for a new account or login with existing credentials
3. Browse products and add them to your cart
4. Proceed to checkout and complete your order
5. View your order history in the orders section

### For Admins
1. Access the admin panel at `http://localhost:3000/admin`
2. Add new products with images
3. Edit existing product details
4. Delete products as needed
5. Manage the product catalog

## 💳 Payment Integration

This application supports two payment methods:
- **Cash on Delivery (COD)**: Traditional payment method
- **Razorpay**: Online payment gateway integration

To enable Razorpay payments:
1. Sign up for a Razorpay account
2. Get your API keys from the Razorpay dashboard
3. Add the keys to your `.env` file
4. Test the payment integration

## 🛡️ Security Features

- Password hashing using bcrypt
- Session-based authentication
- Input validation and sanitization
- Secure file upload handling
- Environment variable protection

## 📱 Responsive Design

The application is designed to work seamlessly across different devices:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Development

### Available Scripts
- `npm start`: Start the application
- `npm run start-mongo`: Start MongoDB server

### Adding New Features
1. Create new routes in the `routes/` directory
2. Add corresponding views in the `views/` directory
3. Create helper functions in the `helpers/` directory if needed
4. Update models in the `models/` directory for new data structures



If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all environment variables are set correctly
4. Check that all dependencies are installed



**Note**: This is a development version. For production deployment, ensure proper security measures, SSL certificates, and environment-specific configurations are in place. 