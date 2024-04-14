import { useEffect, useMemo, useState } from "react";
import { db } from "../data/db";

export const useCart = () => {
	const inicialCart = () => {
		const localStorageCart = localStorage.getItem("cart");
		return localStorageCart ? JSON.parse(localStorageCart) : [];
	};
	const [data] = useState(db);
	const [cart, setCart] = useState(inicialCart);

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	function addToCart(item) {
		const itemExists = cart.findIndex(
			(guitar) => guitar.id === item.id
		);
		if (itemExists >= 0) {
			const updatedCart = [...cart];
			updatedCart[itemExists].quantity++;
			setCart(updatedCart);
		} else {
			item.quantity = 1;
			setCart([...cart, item]);
		}
	}

	function removeFromCart(id) {
		setCart((prevCart) =>
			prevCart.filter((guitar) => guitar.id !== id)
		);
	}

	function clearCart() {
		setCart([]);
	}

	function increaseQuantity(id) {
		const updatedCart = cart.map((item) => {
			if (item.id === id && item.quantity < 5) {
				return { ...item, quantity: item.quantity + 1 };
			}
			return item;
		});
		setCart(updatedCart);
	}

	function dicreaseQuantity(id) {
		const updatedCart = cart.map((item) => {
			if (item.id === id && item.quantity > 1) {
				return { ...item, quantity: item.quantity - 1 };
			}

			return item;
		});
		setCart(updatedCart);
	}

	//State Derivado
	const isEmpty = useMemo(() => cart.length === 0, [cart]);
	const cartTotal = useMemo(
		() =>
			cart.reduce(
				(total, item) =>
					total + item.quantity * item.price,
				0
			),
		[cart]
	);

	return {
		data,
		cart,
		addToCart,
		removeFromCart,
		clearCart,
		increaseQuantity,
		dicreaseQuantity,
		isEmpty,
		cartTotal,
	};
};
