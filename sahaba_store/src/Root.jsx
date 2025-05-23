import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Page/Home";

import One from "./Page/AllProduct/One";
import Two from "./Page/AllProduct/Two";
import Contact from "./Page/Contact";
import Wishlist from "./Page/Wishlist";


import Login from "./Page/user/Login";
import Register from "./Page/user/Register";
import AddToCart from "./Page/AddToCart";
import Adminpage from "./Page/AdminPannel/Adminpage";
import Dashboard from "./Page/AdminPannel/Dashboard";
import AllUsers from "./Page/AdminPannel/AllUsers";
import AllOrders from "./Page/AdminPannel/AllOrders";
import AllCategories from "./Page/AdminPannel/AllCategories";
import AllProducts from "./Page/AdminPannel/AllProducts";
import CouponManagement from "./Page/AdminPannel/CouponManagement";
import AllProdect from "./Page/AllProdect";
import CheckoutPage from "./Page/CheckoutPage";
import OrderConfirmation from "./Page/OrderConfirmation";
import ProductDetails from "./Page/ProductDetails";
import ErrorPage from "./Conponents/ErrorPage";



const Root = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement:<ErrorPage></ErrorPage>,
    children:[

      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/allproduct',
        element: <AllProdect></AllProdect>
      },
      {
        path: '/allproduct/:category',
        element: <AllProdect />
      },
      
      {
        path: '/contact',
        element: <Contact></Contact>
      },
      {
        path: '/wishlist',
        element: <Wishlist></Wishlist>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },      {
        path: '/addtocart',
        element: <AddToCart></AddToCart>
      },
      {
        path: '/add-to-cart',
        element: <AddToCart></AddToCart>
      },
      {
        path: '/checkout',
        element: <CheckoutPage></CheckoutPage>
      },
      {
        path: '/orderOverview',
        element: <OrderConfirmation></OrderConfirmation>
      },
      {
        path: '/product-details/:id',
        element: <ProductDetails></ProductDetails>
      },



      {
  path: '/adminpage',
  element: <Adminpage />,
  children: [
    { path: 'dashboard', element: <Dashboard></Dashboard> },
    { path: 'allusers', element: <AllUsers></AllUsers> },
    { path: 'allorders', element: <AllOrders ></AllOrders>},
    { path: 'allcategories', element: <AllCategories></AllCategories> },
    { path: 'allproducts', element: <AllProducts></AllProducts>},
    { path: 'cuponcodes', element: <CouponManagement></CouponManagement> },
  ]
},




    ]
  },

  
]);
export default Root