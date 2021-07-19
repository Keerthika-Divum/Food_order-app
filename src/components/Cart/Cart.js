import React, { useContext ,useState} from 'react';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';
const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(); 
  const [didSubmit, setDidSubmit] = useState(false);
  const CartCtx = useContext(CartContext);
  const totalAmount = `$${CartCtx.totalAmount.toFixed(2)}`;
  const hasItems = CartCtx.items.length > 0;
  
  const cartItemRemoveHandler = (id) => {
    CartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    CartCtx.addItem({...item, amount: 1});
  };

  const orderClickHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmitted(true);
    await fetch("https://food-app-http-default-rtdb.firebaseio.com/orders.json",{
      method : "POST",
      body : JSON.stringify({
        user: userData,
        orderedItems : CartCtx.items
      })
    });
    setIsSubmitted(false);
    setDidSubmit(true);
    CartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {CartCtx.items.map((item) => (
        <CartItem 
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null,item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
        <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
        {hasItems && (<button className={classes.button} onClick={orderClickHandler}>Order</button>)}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitted && !didSubmit && cartModalContent}
      {isSubmitted && isSubmittingModalContent}
      {!isSubmitted && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;