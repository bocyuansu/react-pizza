import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import EmptyCart from '../cart/EmptyCart';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import store from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { fetchAddress } from '../user/userSlice';

// 驗證手機號碼
const isValidTwPhone = (str) => /^09[0-9]{8}$/.test(str);

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // 取得 提交表單執行的 action function 所 return 的內容
  // 通常用於錯誤處理，這邊是取得 errors 物件
  const formErrors = useActionData();

  // 購物車資料
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  if (!cart.length) return <EmptyCart />;

  // GPS 資料
  const isLoadingAddress = addressStatus === 'loading';

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* 使用 react-router 提供的 Form 組件 */}
      {/* method 只能使用 post , patch , delete */}
      {/* <Form method='POST' action='/order/new'> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={username}
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="relative grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
            {!position.latitude && !position.longitude && (
              <span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px]">
                <Button
                  disabled={isLoadingAddress}
                  type="small"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(fetchAddress());
                  }}
                >
                  Get Position
                </Button>
              </span>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? '下單中...'
              : `立即下單 ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// 只要提交表單，就會創建一個請求，一旦我們將其與 React Router 連接
// 這個請求就會被這個 action 函數攔截
// 所以一旦表單提交，就會調用 action 函數

export async function action({ request }) {
  // 取得提交的表單資料
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  console.log(order);

  // 表單錯誤處理
  const errors = {};

  // 使用 正規表達 驗證手機號碼
  if (!isValidTwPhone(order.phone)) {
    errors.phone = '請輸入正確的手機號碼';
  }

  // 如果至少有一個錯誤，就 return errors 物件
  if (Object.keys(errors).length > 0) return errors;

  // 提交表單之後，將頁面重新導向到顯示訂單的頁面
  // 不能使用 navigate，因為 Hook 只能在組件內使用
  // 使用 react-router 提供的 redirect 重新導向頁面
  const newOrder = await createOrder(order);

  // 不要過度使用這個方式，因為它會在這個頁面上停用 Redux 的一些性能優化
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
