"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import useFetch from "@/components/hooks/useFetch";
import { Product } from "@/components/types/product";
import UserContext from "@/components/context/userContext";
import styles from "./page.module.scss";


export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState("Blanc Pur");

    const { addToCart } = useContext(UserContext);
    
    const { fetchData, data, error, loading } = useFetch({
        url: `product/getProductById/?id=${params.id}`,
        method: "GET"
    });

    useEffect(() => {
        if (params.id) {
            fetchData();
        }
    }, [params.id, fetchData]);

    useEffect(() => {
        if (data && data.success) {
            setProduct(data.data as Product);
        }
    }, [data]);

    const colors = [
        { name: "Blanc Pur", value: "#FFFFFF", selected: selectedColor === "Blanc Pur" },
        { name: "Noir Carbone", value: "#2C2C2C", selected: selectedColor === "Noir Carbone" },
        { name: "Rouge Passion", value: "#DC2626", selected: selectedColor === "Rouge Passion" },
        { name: "Bleu Océan", value: "#1E40AF", selected: selectedColor === "Bleu Océan" },
        { name: "Gris Métallique", value: "#6B7280", selected: selectedColor === "Gris Métallique" },
    ];

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement du produit...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.error}>
                <h2>Produit introuvable</h2>
                <p>Le produit que vous recherchez n&apos;existe pas ou n&apos;est plus disponible.</p>
                <button onClick={() => router.push('/products')} className={styles.backButton}>
                    Retour aux produits
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <button onClick={() => router.push('/')}>Accueil</button>
                <span>/</span>
                <button onClick={() => router.push('/products')}>Produits</button>
                <span>/</span>
                <span>{product.name}</span>
            </nav>

            <div className={styles.productDetail}>
                {/* Section gauche - Images */}
                <div className={styles.imageSection}>
                    <div className={styles.mainImage}>
                        <img
                            src={product.imageUrl[selectedImageIndex] || "/placeholder-car.jpg"}
                            alt={product.name}
                            className={styles.productImage}
                        />
                    </div>
                    
                    {product.imageUrl.length > 1 && (
                        <div className={styles.imageNavigation}>
                            <button
                                onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                                disabled={selectedImageIndex === 0}
                                className={styles.navButton}
                            >
                                ‹
                            </button>
                            <button
                                onClick={() => setSelectedImageIndex(Math.min(product.imageUrl.length - 1, selectedImageIndex + 1))}
                                disabled={selectedImageIndex === product.imageUrl.length - 1}
                                className={styles.navButton}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>

                {/* Section droite - Informations et personnalisation */}
                <div className={styles.infoSection}>

                    <div className={styles.customization}>
                        <h3>Couleurs extérieures</h3>
                        <div className={styles.colorOptions}>
                            {colors.map((color) => (
                                <div
                                    key={color.name}
                                    className={`${styles.colorOption} ${color.selected ? styles.selected : ''}`}
                                    onClick={() => setSelectedColor(color.name)}
                                >
                                    <div
                                        className={styles.colorCircle}
                                        style={{ backgroundColor: color.value }}
                                    ></div>
                                    <span className={styles.colorName}>{color.name}</span>
                                    {color.selected && (
                                        <div className={styles.selectedIndicator}>
                                            <div className={styles.checkmark}>✓</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.description}>
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className={styles.pricing}>
                        <div className={styles.price}>
                            <span className={styles.priceLabel}>Prix:</span>
                            <span className={styles.priceValue}>{product.price.toLocaleString()}€</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={() => {
                                addToCart({
                                    id: product.id.toString(),
                                    name: product.name,
                                    price: product.price,
                                    quantity: 1,
                                    selectedColor: selectedColor,
                                    selectedOptions: { color: selectedColor }
                                });
                                router.push('/cart');
                            }}
                            className={styles.addToCartButton}
                        >
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 