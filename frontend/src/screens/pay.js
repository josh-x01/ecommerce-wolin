import { v4 } from 'uuid';
import React, { useContext, useEffect, useReducer } from 'react';
import { Store } from '../Store';
import { homepage } from '../config';
// import request from 'request';

export default function Pay() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  const { hostname, port } = window.location;
  console.log(hostname, port);
  return <>
    <form method="POST" action="https://api.chapa.co/v1/hosted/pay" >

      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="public_key" value="CHAPUBK_TEST-m5QOcD4fsPec7V9UCZdCFdzoeEr0jzJA" /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="tx_ref" value={v4()} /></div>
      <div className="form-outline mb-4">
        <label className='form-label'>Amount</label>
        <input type="text" className='form-control' name="amount" value={cart.itemsPrice.toFixed(2)} placeholder="100" /></div>
      <div className="form-outline mb-4">
        <label className='form-label'>Currency</label>
        <input type="text" className='form-control' name="currency" value="ETB" /></div>
      <div className="form-outline mb-4">
        <label className='form-label'>Email</label>
        <input type="text" className='form-control' name="email" placeholder="israel@gmail.com" /></div>
      <div className="form-outline mb-4">
        <input type="text" className='form-control' name="phone" placeholder="09*******" /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="first_name" value="Israel" /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="last_name" value="Goytom" /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="title" value="Let us do this" /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="description" value="Paying with Confidence with cha" /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="logo" value="https://chapa.link/asset/images/chapa_swirl.svg" /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="callback_url" value={`${homepage}`} /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="return_url" value={`${homepage}`} /></div>
      <div className="form-outline mb-4">
        <input type="hidden" className='form-control' name="meta[title]" value="test" /></div>
      <div className="form-outline mb-4">
        <button type="submit" className='btn btn-primary'>Pay now</button>
      </div>
    </form>
  </>
}
