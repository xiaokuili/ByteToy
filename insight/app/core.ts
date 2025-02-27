"""

import { APICallError } from "ai"

insight流程： 
1. inqure user(user input + ui check)
    1. from {source} search {keyword} 
    2. how to show result 
2. do search， 通过createStream系列接口可以进行交互
    1. rag 
    2. llm2sql + db_tool 
3. export result  
    - API
    - DOC 
    - char, pic, image 
"""
// 根据用户查询结果格式化的结果
export interface SearchResult {
    
}

