import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Home from './ui/Home';
import Error from './ui/Error';
import Menu, { loader as menuLoader } from './features/menu/Menu';
import Cart from './features/cart/Cart';
import CreateOrder, {
  action as createOrderAction,
} from './features/order/CreateOrder';
import Order, { loader as orderLoader } from './features/order/Order';
import { action as updateOrderAction } from './features/order/UpdateOrder';
import AppLayout from './ui/AppLayout';

// 比較新的路由方法
const router = createBrowserRouter(
  [
    {
      element: <AppLayout />, // 被稱為 layout route
      errorElement: <Error />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/menu',
          element: <Menu />,
          loader: menuLoader, // 使用 loader fetch data：第二步
          errorElement: <Error />,
        },
        {
          path: '/cart',
          element: <Cart />,
        },
        {
          path: '/order/new',
          element: <CreateOrder />,
          action: createOrderAction, // 將 action 函式 與 react-router 連結
        },
        {
          path: '/order/:orderId',
          element: <Order />,
          loader: orderLoader, // 將 loader 函式 與 react-router 連結
          errorElement: <Error />,
          action: updateOrderAction,
        },
      ],
    },
  ],
  { basename: '/react-pizza' },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// http://localhost:5173/react-pizza
