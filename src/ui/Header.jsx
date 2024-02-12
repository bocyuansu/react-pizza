import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/SearchOrder';
import UserName from '../features/user/userName';

function Header() {
  return (
    <header className="flex items-center justify-around border-b-2 border-stone-300 bg-yellow-400 px-4 py-3 uppercase sm:px-6">
      <Link to="/" className="tracking-widest">
        Fast React Pizza Co.
      </Link>

      <SearchOrder />
      <UserName />
    </header>
  );
}

export default Header;
