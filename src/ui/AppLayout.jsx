import Header from './Header';
import Loader from './Loader';
import CartOverview from '../features/cart/CartOverview';
import { Outlet, useNavigation } from 'react-router-dom';

function AppLayout() {
  // 有使用 loader 函式，並在 router 連結 loader，
  // navigation.state 才會顯示 'loading'，否則都是 'idle'
  // 所以只有連結 loader 函式，才會顯示 <Loader> 組件
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      {isLoading && <Loader />}

      <Header />

      <div className="scrollBar">
        <main className="mx-auto max-w-3xl">
          {/* 放置子路由的地方 */}
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
