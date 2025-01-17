import {ContentType, OutlineItem} from "./generateOutline"

const textGenerators =  {
    title: (title: string) => title
}

export const generateText = (outline: OutlineItem) => {
    const generator = textGenerators[outline?.type as keyof typeof textGenerators]
    if (!generator) {
        throw new Error(`Unsupported content type: ${outline.type}`)
    }

    return generator(outline.title)
}