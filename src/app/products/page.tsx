"use client";

import { useEffect, useState } from "react";
import useFetch from "../../components/hooks/useFetch";
import { Product } from "../../components/types/product";
import Input from "../../components/UI/Input";
import styles from "./index.module.scss";
import { useRouter } from "next/navigation";
import Chatbot from "@/components/UI/Chatbot";

interface FetchParams {
    page: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    filters: {
        search: string;
        category: string;
        minPrice: number | null;
        maxPrice: number | null;
    };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const Router = useRouter();

    const [fetchParams, setFetchParams] = useState<FetchParams>({
        page: 1,
        sortBy: "createdAt",
        sortOrder: "desc",
        filters: {
            search: "",
            category: "",
            minPrice: null,
            maxPrice: null
        }
    });

    const { fetchData, data, error, loading } = useFetch({
        url: "product/getProductsWithFilters",
        method: "POST",
        body: fetchParams
    });

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (data && data.success) {
            setProducts(data.data as Product[]);
        }
    }, [data]);

    if (loading) {
        return (<p>Chargement des produits...</p>);
    }
    if (error) {
        return (<p>{error}</p>);
    }
    return (
        <>
            <div className={styles.hero}>
                <h1>Produits</h1>
                <p>Découvrez notre sélection de produits de qualité</p>
            </div>

            {/* Boutons de contrôle */}
            <div className={styles.paramsWrapper}>
                {/* search */}
                <div className={styles.searchGroup}>
                    <Input
                        type="text"
                        value={fetchParams.filters.search || ""}
                        name="search"
                        onChange={(e) => setFetchParams((prev) => ({
                            ...prev,
                            filters: {
                                ...prev.filters,
                                search: e.target.value
                            }
                        }))}
                        placeholder="Rechercher un produit..."
                    />
                </div>

                {/* filter */}
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`${styles.toggleButton} ${showFilters ? styles.active : ''}`}
                >
                    <p>Filtrer</p>
                    <img src="/icons/filter.svg" alt="Filter" className={styles.filterIcon} />
                    {/* Section Filtres */}
                    {showFilters && (
                        <div className={styles.filtersSection}>
                            <h3>Filtres</h3>
                            <div className={styles.controlsGrid}>

                                {/* Catégorie */}
                                <div className={styles.controlGroup}>
                                    <label>Catégorie:</label>
                                    <input
                                        type="text"
                                        value={fetchParams.filters.category || ""}
                                        onChange={(e) => setFetchParams((prev) => ({
                                            ...prev,
                                            filters: {
                                                ...prev.filters,
                                                category: e.target.value
                                            }
                                        }))}
                                        placeholder="Ex: compact, Renault..."
                                        className={styles.controlInput}
                                    />
                                </div>

                                {/* Prix minimum */}
                                <div className={styles.controlGroup}>
                                    <label>Prix minimum:</label>
                                    <input
                                        type="number"
                                        value={fetchParams.filters.minPrice || ""}
                                        onChange={(e) => setFetchParams((prev) => ({
                                            ...prev,
                                            filters: {
                                                ...prev.filters,
                                                minPrice: e.target.value ? parseFloat(e.target.value) : null
                                            }
                                        }))}
                                        placeholder="0"
                                        className={styles.controlInput}
                                    />
                                </div>

                                {/* Prix maximum */}
                                <div className={styles.controlGroup}>
                                    <label>Prix maximum:</label>
                                    <input
                                        type="number"
                                        value={fetchParams.filters.maxPrice || ""}
                                        onChange={(e) => setFetchParams((prev) => ({
                                            ...prev,
                                            filters: {
                                                ...prev.filters,
                                                maxPrice: e.target.value ? parseFloat(e.target.value) : null
                                            }
                                        }))}
                                        placeholder="1000"
                                        className={styles.controlInput}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </button>

                {/* Tri */}
                <button 
                    onClick={() => setShowSort(!showSort)}
                    className={`${styles.toggleButton} ${showSort ? styles.active : ''}`}
                >
                    <p>Trier</p>
                    <img src="/icons/sort.svg" alt="Sort" className={styles.filterIcon} />
                    {/* Section Tri */}
                    {showSort && (
                        <div className={styles.sortSection}>
                            <h3>Tri</h3>
                            <div className={styles.controlsGrid}>
                                {/* Tri */}
                                <div className={styles.controlGroup}>
                                    <label>Trier par:</label>
                                    <select
                                        value={fetchParams.sortBy}
                                        onChange={(e) => setFetchParams((prev) => ({
                                            ...prev,
                                            sortBy: e.target.value
                                        }))}
                                        className={styles.controlSelect}
                                    >
                                        <option value="name">Nom</option>
                                        <option value="price">Prix</option>
                                        <option value="createdAt">Date de création</option>
                                    </select>
                                </div>

                                {/* Ordre de tri */}
                                <div className={styles.controlGroup}>
                                    <label>Ordre:</label>
                                    <select
                                        value={fetchParams.sortOrder}
                                        onChange={(e) => setFetchParams((prev) => ({
                                            ...prev,
                                            sortOrder: e.target.value as "asc" | "desc"
                                        }))}
                                        className={styles.controlSelect}
                                    >
                                        <option value="asc">Croissant</option>
                                        <option value="desc">Décroissant</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </button>

            </div>
            
            {/* Products */}
            <div className={styles.resultsInfo}>
                {products.map((product) => (
                    <div key={product.id} className={styles.productCard} onClick={() => Router.push(`/products/${product.id}`)}>
                        <div className={styles.imageContainer}>
                            <img
                                src={product.imageUrl[0] || "/placeholder-car.jpg"}
                                alt={product.name}
                                className={styles.productImage}
                            />
                        </div>

                        <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.productDescription}>{product.description}</p>

                            <div className={styles.categoryTags}>
                                {product.category.map((cat) => (
                                    <span key={cat} className={styles.categoryTag}>
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            <div className={styles.productFooter}>
                                <span className={styles.price}>{product.price}€</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && !loading && (
                <div className={styles.noResults}>
                    <h3>Aucun produit trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                </div>
            )}

            {/* Pagination */}
            <div className={styles.pagination}>
                <button 
                    onClick={() => setFetchParams((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                    disabled={fetchParams.page === 1}
                    className={styles.pageButton}
                >
                    Page précédente
                </button>
                <span className={styles.pageInfo}>Page {fetchParams.page}</span>
                <button
                    onClick={() => setFetchParams((prev) => ({ ...prev, page: prev.page + 1 }))}
                    className={styles.pageButton}
                >
                    Page suivante
                </button>
            </div>

            <div className={styles.resultsInfo}>
                <p>{products.length} produit(s) trouvé(s)</p>
            </div>

            {/* Chatbot flottant */}
            <Chatbot />
        </>         
    );
}