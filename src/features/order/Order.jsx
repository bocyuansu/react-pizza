// Test ID: IIDSAT
import OrderItem from './OrderItem';
import { useFetcher, useLoaderData } from 'react-router-dom';
import { getOrder } from '../../services/apiRestaurant';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '../../utils/helpers';
import { useEffect } from 'react';
import UpdateOrder from './UpdateOrder';

function Order() {
  // 取得 loader 函式所 return 的資料
  const order = useLoaderData();

  const fetcher = useFetcher();

  useEffect(() => {
    // 取得 menu 頁面的 loader 資料
    if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu');
  }, [fetcher]);

  // 每個人都可以搜尋所有訂單，因此出於隱私原因，排除姓名或地址，這些姓名僅供餐廳工作人員使用
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              優先送達
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            訂單{status === 'preparing' ? '準備中' : '已送達'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `大約還需要 ${calcMinutesLeft(estimatedDelivery)} 分鐘 😃`
            : '訂單已經抵達'}
        </p>
        <p className="text-stone-500">
          (預計送達時間: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-200 border-b border-t">
        {cart.map((item) => (
          <OrderItem
            key={item.pizzaId}
            item={item}
            isLoadingIngredients={fetcher.state === 'loading'}
            ingredients={
              fetcher?.data?.find((el) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="font-medium text-stone-600">
          披薩費用: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="font-medium text-stone-600">
            優先送達手續費: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          貨到付款: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>
      {!priority && <UpdateOrder order={order} />}
    </div>
  );
}

// 進入頁面時，navigation.state = 'loading'，顯示 <Loader /> 組件，並且會執行 loader function，
// 等到 fetch data 完成，navigation.state = 'idle'，隱藏 <Loader /> 組件，並渲染 Order 組件
export async function loader({ params }) {
  // 取得 url 中 orderId 變數，並發送 get 請求，取得訂單資料
  const order = await getOrder(params.orderId);

  return order;
}

export default Order;
