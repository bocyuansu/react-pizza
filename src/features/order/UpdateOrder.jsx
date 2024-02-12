import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';
import { updateOrder } from '../../services/apiRestaurant';

function UpdateOrder({ order }) {
  const fetcher = useFetcher();

  // fetcher.Form 只是提交一個表單，然後重新驗證頁面，並不會重新導航

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">將訂單變更為優先送達</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}

// request 用於取得表單資料
// params 用於獲取 url 變數
