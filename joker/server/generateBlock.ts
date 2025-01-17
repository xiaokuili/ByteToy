import {ContentType, OutlineItem} from "./generateOutline"

// 定义不同类型的数据接口
interface TitleData {
    text: string
}

interface ListData {
    items: string[]
}

interface ImageData {
    url: string
    alt?: string
}

interface AGIData {
    text: string
}

// 定义具体的 Block 类型
type BlockData = TitleData | ListData | ImageData | AGIData

interface Block {
    type: ContentType
    description: string
    data: BlockData
}

// 数据生成器
const dataGenerators = {
    title: (description: string): TitleData => ({
        text: description
    }),
    list: (description: string): ListData => ({
        items: description.split(',').map(item => item.trim())
    }),
    image: (description: string): ImageData => ({
        url: description,
        alt: ''
    }),
    agi: (description: string): AGIData => ({
        text: "AI生成内容" + description
    })


    // 可以继续添加其他类型的生成器
}




export const generateBlock = async (outline: OutlineItem): Promise<Block> => {
    const type = outline.type ?? 'title'
    const generator = dataGenerators[type as keyof typeof dataGenerators]
    
    if (!generator) {
        throw new Error(`Unsupported content type: ${type}`)
    }

    return {
        type,
        description: outline.title,
        data: generator(outline.title)
    }
}