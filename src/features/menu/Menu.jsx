import { useLoaderData } from 'react-router-dom';
import { getMenu } from '../../services/apiRestaurant';
import MenuItem from './MenuItem';

function Menu() {
  // 使用 loader fetch data：第三步
  const menu = useLoaderData();

  return (
    <ul className="divide-y-2 divide-stone-200 px-2">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

// 使用 loader fetch data：第一步 （第二步 -> App.jsx）
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
