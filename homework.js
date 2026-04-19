// ========================================
// 第五週作業：電商資料處理系統
// ========================================

// ========== 提供的資料結構 ==========

// 產品資料
const products = [
	{
		id: "prod-1",
		title: "經典白T",
		category: "衣服",
		origin_price: 500,
		price: 399,
		images: "https://example.com/t1.jpg",
	},
	{
		id: "prod-2",
		title: "牛仔褲",
		category: "褲子",
		origin_price: 1200,
		price: 899,
		images: "https://example.com/p1.jpg",
	},
	{
		id: "prod-3",
		title: "帆布鞋",
		category: "鞋子",
		origin_price: 1800,
		price: 1299,
		images: "https://example.com/s1.jpg",
	},
	{
		id: "prod-4",
		title: "棒球帽",
		category: "配件",
		origin_price: 350,
		price: 299,
		images: "https://example.com/h1.jpg",
	},
	{
		id: "prod-5",
		title: "運動外套",
		category: "衣服",
		origin_price: 2000,
		price: 1599,
		images: "https://example.com/j1.jpg",
	},
];

// 購物車資料
const carts = [
	{ id: "cart-1", product: products[0], quantity: 2 },
	{ id: "cart-2", product: products[2], quantity: 1 },
	{ id: "cart-3", product: products[4], quantity: 1 },
];

// 訂單資料
const orders = [
	{
		id: "order-1",
		createdAt: 1704067200, // Unix timestamp
		paid: false,
		total: 2097,
		user: {
			name: "王小明",
			tel: "0912345678",
			email: "ming@example.com",
			address: "台北市信義區",
			payment: "ATM",
		},
		products: [
			{ ...products[0], quantity: 2 },
			{ ...products[2], quantity: 1 },
		],
	},
	{
		id: "order-2",
		createdAt: 1704153600,
		paid: true,
		total: 899,
		user: {
			name: "李小華",
			tel: "0923456789",
			email: "hua@example.com",
			address: "台中市西區",
			payment: "Credit Card",
		},
		products: [{ ...products[1], quantity: 1 }],
	},
];

// ========================================
// 任務一：產品查詢模組 (基礎)
// ========================================

/**
 * 1. 根據 ID 查詢產品
 * @param {Array} products - 產品陣列
 * @param {string} productId - 產品 ID
 * @returns {Object|null} - 回傳產品物件，找不到回傳 null
 */
function getProductById(products, productId) {
	// .find() 會逐一檢查陣列，回傳第一個符合條件的元素
	// 若沒有找到，.find() 回傳 undefined，|| null 確保最終回傳 null 而非 undefined
	return products.find((item) => item.id === productId) || null;
}

/**
 * 2. 根據分類篩選產品
 * @param {Array} products - 產品陣列
 * @param {string} category - 分類名稱
 * @returns {Array} - 回傳符合分類的產品陣列，若 category 為 '全部' 則回傳全部產品
 */
function getProductsByCategory(products, category) {
	// 傳入 '全部' 時，用展開運算子 [...products] 回傳一個新陣列（避免直接回傳原陣列的參照）
	if (category === "全部") {
		return [...products];
	}
	// .filter() 會保留所有回傳 true 的元素，形成一個新陣列
	return products.filter((item) => item.category === category);
}

/**
 * 3. 計算產品折扣率
 * @param {Object} product - 產品物件
 * @returns {string} - 回傳折扣百分比，例如 '8折' 或 '79折'
 * 計算方式：Math.round((price / origin_price) * 100) / 10
 */
function getDiscountRate(product) {
	// 解構賦值：從 product 物件中取出 price 和 origin_price
	const { price, origin_price } = product;
	// 計算步驟：(售價/原價) 得到小數 → ×100 轉成百分比 → Math.round 四捨五入 → ÷10 轉成幾折
	// 例如：399/500 = 0.798 → ×100 = 79.8 → round = 80 → ÷10 = 8 → '8折'
	const rate = Math.round((price / origin_price) * 100) / 10;
	// 樣板字面值（template literal）：用反引號 `` 和 ${} 將變數嵌入字串
	return `${rate}折`;
}

/**
 * 4. 取得所有產品分類（不重複）
 * @param {Array} products - 產品陣列
 * @returns {Array} - 回傳分類陣列，例如 ['衣服', '褲子', '鞋子', '配件']
 */
function getAllCategories(products) {
	// .map() 將每個產品轉換成只保留 category 欄位的新陣列，例如 ['衣服', '褲子', '衣服', ...]
	const allCategories = products.map((item) => item.category);
	// Set 是一種集合結構，自動去除重複值
	const categorySet = new Set(allCategories);
	// 展開運算子將 Set 轉回一般陣列，例如 ['衣服', '褲子', '鞋子', '配件']
	return [...categorySet];
}

// ========================================
// 任務二：購物車計算模組 (中階)
// ========================================

/**
 * 1. 計算購物車原價總金額
 * @param {Array} carts - 購物車陣列
 * @returns {number} - 回傳數字（原價 × 數量 的總和）
 */
function calculateCartOriginalTotal(carts) {
	// .reduce(callback, 初始值) 會將陣列「累加」成單一值
	// accumulator：目前累計的總金額，從初始值 0 開始
	// currentValue：當前正在處理的購物車項目
	return carts.reduce((accumulator, currentValue) => {
		const { origin_price } = currentValue.product; // 取出產品原價
		const { quantity } = currentValue; // 取出購買數量
		return accumulator + origin_price * quantity; // 累加：原價 × 數量
	}, 0); // 初始值為 0
}

/**
 * 2. 計算購物車售價總金額
 * @param {Array} carts - 購物車陣列
 * @returns {number} - 回傳數字（售價 × 數量 的總和）
 */
function calculateCartTotal(carts) {
	// 與 calculateCartOriginalTotal 相同結構，但改用售價 price 計算
	return carts.reduce((accumulator, currentValue) => {
		const { price } = currentValue.product; // 取出售價（非原價）
		const { quantity } = currentValue;
		return accumulator + price * quantity;
	}, 0);
}

/**
 * 3. 計算總共省下多少錢
 * @param {Array} carts - 購物車陣列
 * @returns {number} - 回傳原價總金額 - 售價總金額
 */
function calculateSavings(carts) {
	// 直接呼叫已定義的函式來重用邏輯，避免重複撰寫 reduce
	// 原價總計 - 售價總計 = 省下的金額
	return calculateCartOriginalTotal(carts) - calculateCartTotal(carts);
}

/**
 * 4. 計算購物車商品總數量
 * @param {Array} carts - 購物車陣列
 * @returns {number} - 回傳所有商品的 quantity 總和
 */
function calculateCartItemCount(carts) {
	// 用 reduce 將每筆購物車項目的 quantity 累加
	// 例如 quantity: [2, 1, 1] → 總數量 4
	return carts.reduce((accumulator, currentValue) => {
		return accumulator + currentValue.quantity;
	}, 0);
}

/**
 * 5. 檢查產品是否已在購物車中
 * @param {Array} carts - 購物車陣列
 * @param {string} productId - 產品 ID
 * @returns {boolean} - 回傳 true 或 false
 */
function isProductInCart(carts, productId) {
	// .some() 只要陣列中有任一元素符合條件就回傳 true，全部不符合才回傳 false
	// 比起 .find() 再判斷結果，.some() 語意更直接：「是否存在？」
	return carts.some((item) => item.product.id === productId);
}

// ========================================
// 任務三：購物車操作模組 (進階)
// ========================================

/**
 * 1. 新增商品到購物車
 * @param {Array} carts - 購物車陣列
 * @param {Object} product - 產品物件
 * @param {number} quantity - 數量
 * @returns {Array} - 回傳新的購物車陣列（不要修改原陣列）
 * 如果產品已存在，合併數量；如果不存在，新增一筆
 */
function addToCart(carts, product, quantity) {
	// 先判斷產品是否已存在於購物車中
	const isExist = carts.some((item) => item.product.id === product.id);

	if (isExist) {
		// 已存在：用 .map() 遍歷所有項目，找到目標就回傳新物件（數量相加），其他原樣回傳
		// { ...item } 展開原物件，quantity: ... 覆蓋掉舊的 quantity 欄位（不可變性原則）
		return carts.map((item) => {
			if (item.product.id === product.id) {
				return { ...item, quantity: item.quantity + quantity };
			}
			return item;
		});
	}

	// 不存在：建立新的購物車項目
	// Date.now() 回傳當前毫秒時間戳，用來產生不重複的 ID
	// { ...product } 複製一份產品資料，避免共用同一個物件參照
	const newCartItem = {
		id: `cart-${Date.now()}`,
		product: { ...product },
		quantity,
	};
	// 用展開運算子建立新陣列，將新項目加在最後
	return [...carts, newCartItem];
}

/**
 * 2. 更新購物車商品數量
 * @param {Array} carts - 購物車陣列
 * @param {string} cartId - 購物車項目 ID
 * @param {number} newQuantity - 新數量
 * @returns {Array} - 回傳新的購物車陣列，如果 newQuantity <= 0，移除該商品
 */
function updateCartItemQuantity(carts, cartId, newQuantity) {
	// 數量 <= 0 視為「移除」：用 .filter() 保留所有「不是」目標 ID 的項目
	if (newQuantity <= 0) {
		return carts.filter((item) => item.id !== cartId);
	}
	// 數量 > 0：用 .map() 找到目標，回傳覆蓋 quantity 的新物件；其他項目原樣回傳
	return carts.map((item) => {
		if (item.id === cartId) {
			return { ...item, quantity: newQuantity }; // 展開原物件再覆蓋 quantity
		}
		return item;
	});
}

/**
 * 3. 從購物車移除商品
 * @param {Array} carts - 購物車陣列
 * @param {string} cartId - 購物車項目 ID
 * @returns {Array} - 回傳移除後的新購物車陣列
 */
function removeFromCart(carts, cartId) {
	// .filter() 保留所有「不符合」條件的項目，等於把目標項目排除掉
	// 回傳新陣列，不修改原本的 carts
	return carts.filter((item) => item.id !== cartId);
}

/**
 * 4. 清空購物車
 * @returns {Array} - 回傳空陣列
 */
function clearCart() {
	// 每次呼叫都回傳一個全新的空陣列，符合不可變性原則
	return [];
}

// ========================================
// 任務四：訂單統計模組 (挑戰)
// ========================================

/**
 * 1. 計算訂單總營收
 * @param {Array} orders - 訂單陣列
 * @returns {number} - 只計算已付款 (paid: true) 的訂單
 */
function calculateTotalRevenue(orders) {
	// 鏈式寫法：先過濾再累加，兩個步驟合成一行
	// 步驟 1：.filter() 只保留 paid === true 的已付款訂單
	// 步驟 2：.reduce() 將這些訂單的 total 欄位加總，初始值為 0
	return orders
		.filter((order) => order.paid === true)
		.reduce((acc, cur) => acc + cur.total, 0);
}

/**
 * 2. 篩選訂單狀態
 * @param {Array} orders - 訂單陣列
 * @param {boolean} isPaid - true 回傳已付款訂單，false 回傳未付款訂單
 * @returns {Array} - 回傳篩選後的訂單陣列
 */
function filterOrdersByStatus(orders, isPaid) {
	// isPaid 是 boolean，直接與 order.paid 比較
	// 傳入 true → 回傳已付款；傳入 false → 回傳未付款
	return orders.filter((order) => order.paid === isPaid);
}

/**
 * 3. 產生訂單統計報表
 * @param {Array} orders - 訂單陣列
 * @returns {Object} - 回傳格式：
 * {
 *   totalOrders: 2,
 *   paidOrders: 1,
 *   unpaidOrders: 1,
 *   totalRevenue: 899,
 *   averageOrderValue: 1498  // 所有訂單平均金額
 * }
 */
function generateOrderReport(orders) {
	const totalOrders = orders.length; // 訂單總數

	// 先篩出已付款訂單，後續 paidOrders 和 totalRevenue 都從這個清單計算
	const paidOrdersList = orders.filter((order) => order.paid);
	const paidOrders = paidOrdersList.length;

	// 未付款數量不需要再 filter 一次，直接用總數減去已付款數
	const unpaidOrders = totalOrders - paidOrders;

	// 只加總已付款訂單的金額
	const totalRevenue = paidOrdersList.reduce(
		(accumulator, currentValue) => accumulator + currentValue.total,
		0,
	);

	// 平均金額需要用「所有訂單」（不限付款狀態）來計算
	const totalAmountForAll = orders.reduce(
		(accumulator, currentValue) => accumulator + currentValue.total,
		0,
	);
	// Math.round() 四捨五入，避免出現小數點
	const averageOrderValue = Math.round(totalAmountForAll / totalOrders);

	// 使用物件縮寫語法：key 和變數名稱相同時可省略 value
	return {
		totalOrders,
		paidOrders,
		unpaidOrders,
		totalRevenue,
		averageOrderValue,
	};
}

/**
 * 4. 依付款方式統計
 * @param {Array} orders - 訂單陣列
 * @returns {Object} - 回傳格式：
 * {
 *   'ATM': [order1],
 *   'Credit Card': [order2]
 * }
 */
function groupOrdersByPayment(orders) {
	// reduce 的初始值是空物件 {}，用來存放各付款方式對應的訂單陣列
	// 每次迭代取出 order.user.payment 作為物件的 key
	return orders.reduce((accumulator, currentValue) => {
		const { payment } = currentValue.user; // 取得付款方式，例如 'ATM' 或 'Credit Card'

		// 若該付款方式的 key 尚未存在，先初始化為空陣列
		if (!accumulator[payment]) {
			accumulator[payment] = [];
		}
		accumulator[payment].push(currentValue);
		return accumulator;
	}, {});
}

// ========================================
// 測試區域（可自行修改測試）
// ========================================

// 任務一測試
console.log("=== 任務一測試 ===");
console.log("getProductById:", getProductById(products, "prod-1"));
console.log("getProductsByCategory:", getProductsByCategory(products, "衣服"));
console.log("getDiscountRate:", getDiscountRate(products[0]));
console.log("getAllCategories:", getAllCategories(products));

// 任務二測試
console.log("\n=== 任務二測試 ===");
console.log("calculateCartOriginalTotal:", calculateCartOriginalTotal(carts));
console.log("calculateCartTotal:", calculateCartTotal(carts));
console.log("calculateSavings:", calculateSavings(carts));
console.log("calculateCartItemCount:", calculateCartItemCount(carts));
console.log("isProductInCart:", isProductInCart(carts, "prod-1"));

// 任務三測試
console.log("\n=== 任務三測試 ===");
console.log("addToCart:", addToCart(carts, products[1], 2));
console.log(
	"updateCartItemQuantity:",
	updateCartItemQuantity(carts, "cart-1", 5),
);
console.log("removeFromCart:", removeFromCart(carts, "cart-1"));
console.log("clearCart:", clearCart());

// 任務四測試
console.log("\n=== 任務四測試 ===");
console.log("calculateTotalRevenue:", calculateTotalRevenue(orders));
console.log("filterOrdersByStatus:", filterOrdersByStatus(orders, true));
console.log("generateOrderReport:", generateOrderReport(orders));
console.log("groupOrdersByPayment:", groupOrdersByPayment(orders));

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	getProductById,
	getProductsByCategory,
	getDiscountRate,
	getAllCategories,
	calculateCartOriginalTotal,
	calculateCartTotal,
	calculateSavings,
	calculateCartItemCount,
	isProductInCart,
	addToCart,
	updateCartItemQuantity,
	removeFromCart,
	clearCart,
	calculateTotalRevenue,
	filterOrdersByStatus,
	generateOrderReport,
	groupOrdersByPayment,
};
