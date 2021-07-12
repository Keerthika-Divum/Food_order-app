import { useContext,useEffect,useState } from 'react';

import CartIcon from '../Cart/CartIcon';
import CartContext from '../../store/cart-context';
import classes from './HeaderCartButton.module.css';

const HeaderCartButton = (props) => {
  const [btnIsHighlighted , setBtnIsHighlighted] = useState(false);
  const CartCtx = useContext(CartContext);

  const {items} = CartCtx;

  const numberOfCartItems = items.reduce((curNumber,item)=>{
    return (curNumber+item.amount);
  },0);

  const 
  return (
    <button className={classes.button} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;