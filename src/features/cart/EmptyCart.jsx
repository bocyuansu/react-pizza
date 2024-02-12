import LinkButton from '../../ui/LinkButton';

function EmptyCart() {
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <p className="mt-7 font-semibold">您的購物車是空的，添購一些披薩吧 😊</p>
    </div>
  );
}

export default EmptyCart;
