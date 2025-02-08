import { useState } from "react";

export default function Home() {
    const [code, setCode] = useState("");
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // ポップアップ表示

    // 商品検索APIを呼び出す関数
    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/products/${code}`);
            if (!response.ok) throw new Error("商品がマスタ未登録です");
            const data = await response.json();
            setProduct(data);
            setError("");
        } catch (err) {
            setError(err.message);
            setProduct(null);
        }
    };

    // 商品を購入リストに追加する関数
    const addToCart = () => {
        if (!product) return;
        setCart([...cart, product]);
        setProduct(null);
        setCode("");
    };

    // 購入APIを呼び出す関数
    const purchaseItems = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8080/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart }),
            });

            if (!response.ok) throw new Error("購入に失敗しました");
            const data = await response.json();
            setTotalPrice(data.total_price);
            setCart([]); // カートをクリア
            setShowPopup(true); // ポップアップを表示
        } catch (err) {
            console.error(err.message);
        }
    };

    // ポップアップを閉じる関数
    const closePopup = () => {
        setShowPopup(false);
        setCode(""); // 入力欄をリセット
        setTotalPrice(null);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>POSシステム</h1>

            {/* 商品コード入力欄 */}
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="商品コードを入力"
                style={{ padding: "8px", fontSize: "16px" }}
            />
            <button onClick={fetchProduct} style={{ marginLeft: "10px", padding: "8px", fontSize: "16px" }}>
                検索
            </button>

            {/* エラーメッセージの表示 */}
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

            {/* 検索結果の表示 */}
            {product && (
                <div style={{ marginTop: "20px" }}>
                    <h2>商品情報</h2>
                    <p>コード: {product.code}</p>
                    <p>名称: {product.name}</p>
                    <p>価格: {product.price}円</p>
                    <button onClick={addToCart} style={{ padding: "8px", fontSize: "16px" }}>
                        購入リストに追加
                    </button>
                </div>
            )}

            {/* 購入リストの表示 */}
            <h2 style={{ marginTop: "30px" }}>購入リスト</h2>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>{item.name} - {item.price}円</li>
                ))}
            </ul>

            {/* 購入ボタン */}
            {cart.length > 0 && (
                <button onClick={purchaseItems} style={{ padding: "10px", fontSize: "18px", marginTop: "20px" }}>
                    購入
                </button>
            )}

            {/* 購入完了ポップアップ */}
            {showPopup && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        padding: "20px",
                        backgroundColor: "white",
                        border: "1px solid black",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <p>購入が完了しました！</p>
                    <p>合計金額: {totalPrice}円（税込）</p>
                    <button onClick={closePopup} style={{ padding: "10px", fontSize: "16px" }}>
                        OK
                    </button>
                </div>
            )}
        </div>
    );
}
