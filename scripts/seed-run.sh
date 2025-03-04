#!/bin/bash

# 确保脚本在错误时停止执行
set -e

# 安装必要的依赖
echo "检查并安装必要的依赖..."
npm install --save-dev tsx

echo "开始数据库种子数据插入过程..."

# 运行测试数据插入脚本
# 这里可以根据需要修改为您实际需要插入数据的表的脚本
npx tsx insight/test/run-seed.ts

echo "数据库种子数据插入完成！" 