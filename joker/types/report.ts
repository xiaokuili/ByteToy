// Base interface for outline structure
export interface OutlineNode {
    id: string
    title: string
    depth: number
    nextNodeId: string | null
}

// Interface for content data sources
export interface ContentSource {
    id: string
    sourceUrl: string
    sourceName: string
}

// Interface for AI generation settings
export interface GenerationSettings {
    id: string
    modelName: string
    referenceText: string
}

// Main report outline configuration interface
export interface OutlineConfig extends OutlineNode {
    reportId?: string
    reportTitle?: string
    contentSources?: ContentSource[]
    generationSettings?: GenerationSettings
}