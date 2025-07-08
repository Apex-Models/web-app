"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/components/context/userContext";
import styles from "./page.module.scss";

export default function CartPage() {
    const { cart } = useContext(UserContext);
    const router = useRouter();
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal - discount;

    const handleApplyPromo = () => {
        // Logique simple pour code promo (à adapter selon vos besoins)
        if (promoCode.toUpperCase() === "DISCOUNT10") {
            setDiscount(subtotal * 0.1);
        } else if (promoCode.toUpperCase() === "SAVE20") {
            setDiscount(subtotal * 0.2);
        } else {
            setDiscount(0);
        }
    };

    const handleContinueToCheckout = async () => {
        try {
            const res = await fetch("http://localhost:4001/api/create-checkout-session", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        selectedColor: item.selectedColor
                    }))
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Erreur API:', errorData);
                alert('Erreur lors de la création de la session de paiement');
                return;
            }

            const data = await res.json();
            if (data.success && data.url) {
                window.location.href = data.url; // 🔁 Redirection vers Stripe Checkout
            } else {
                console.error('Erreur lors de la création de la session:', data);
                alert('Erreur lors de la création de la session de paiement');
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            alert('Erreur de connexion au serveur');
        }
    };

    if (cart.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <h2>Votre panier est vide</h2>
                <p>Découvrez nos produits et ajoutez-les à votre panier</p>
                <button 
                    onClick={() => router.push("/products")}
                    className={styles.shopButton}
                >
                    Continuer mes achats
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.cartSection}>
                <div className={styles.cartHeader}>
                    <h1>Cart ({cart.length} product{cart.length > 1 ? 's' : ''})</h1>
                    <button
                        className={styles.clearCartBtn}
                    >
                        ✕ Clear cart
                    </button>
                </div>

                <div className={styles.cartContent}>
                    <div className={styles.tableHeader}>
                        <span>Product</span>
                        <span>Price</span>
                    </div>

                    {cart.map((item) => (
                        <div key={`${item.id}-${item.selectedColor}`} className={styles.cartItem}>
                            <div className={styles.productInfo}>
                                <div className={styles.productImage}>
                                    <img 
                                        src={item.imageUrl && item.imageUrl[0] ? item.imageUrl[0] : "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=200"} 
                                        alt={item.name} 
                                    />
                                </div>
                                <div className={styles.productDetails}>
                                    <h3>{item.name}</h3>
                                    <p>{item.selectedColor}</p>
                                </div>
                            </div>

                            <div className={styles.price}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>

                            <button
                                className={styles.removeBtn}
                                // onClick={() => removeFromCart(item.id)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.checkoutSection}>
                <div className={styles.promoCode}>
                    <h3>Promo code</h3>
                    <div className={styles.promoInput}>
                        <input 
                            type="text"
                            placeholder="Type here..."
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button onClick={handleApplyPromo}>Apply</button>
                    </div>
                </div>

                <div className={styles.summary}>
                    <div className={styles.summaryLine}>
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryLine}>
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryTotal}>
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <button 
                    onClick={handleContinueToCheckout}
                    className={styles.checkoutBtn}
                >
                    Continue to checkout
                </button>
            </div>
        </div>
    );
} 