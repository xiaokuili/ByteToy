import { seedActualTableData } from '@/test/create-test-table';
import 'dotenv/config';
async function main() {
    try {

        // 插入实际表数据
        await seedActualTableData();
        console.log('实际表数据插入成功！');

        process.exit(0);
    } catch (error) {
        console.error('数据插入失败:', error);
        process.exit(1);
    }
}

main(); 