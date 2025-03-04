import { drizzle } from 'drizzle-orm/node-postgres';


const insertDataSql = `
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        price DECIMAL(10,2) NOT NULL, 
        stock INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

const productData = Array.from({ length: 100 }, (_, i) => ({
    name: `商品${i + 1}`,
    price: +(Math.random() * 1000).toFixed(2),
    stock: Math.floor(Math.random() * 1000),
    category: ['电子产品', '家居用品', '服装', '食品', '图书'][i % 5],
    description: `这是第${i + 1}个商品的详细描述，包含了商品的特点和使用方法。`
}));

export async function seedActualTableData() {
    console.log("开始插入实际表测试数据...");

    try {
        // Make sure to install the 'pg' package 
        const db = drizzle(process.env.DATABASE_URL!);
        // 创建products表 - 使用 db.execute 执行原始 SQL
        await db.execute(`${insertDataSql}`);

        // 清空现有数据 - 使用 db.execute 执行原始 SQL
        await db.execute(`TRUNCATE TABLE products`);

        // 插入新测试数据 - 使用 db.insert 而不是原始 SQL
        for (const product of productData) {
            await db.execute(`
                INSERT INTO products (name, price, stock, category, description)
                VALUES ('${product.name}', '${product.price}', '${product.stock}', '${product.category}', '${product.description}')
            `);
        }

        console.log(`成功插入商品测试数据`);
    } catch (error) {
        console.error("插入商品测试数据失败:", error);
        throw error;
    }
}