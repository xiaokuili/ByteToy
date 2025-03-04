#!/bin/bash

# 确保脚本在错误时停止执行
set -e

echo "开始数据库种子数据插入过程..."

# 运行测试数据插入脚本
npx tsx /Users/root1/mycode/ByteToy/insight/test/run-seed.ts

echo "数据库种子数据插入完成！" 