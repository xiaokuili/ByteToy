export interface Block {
  id: string
  type: string
  title: string
  // 可以根据需要添加更多属性
}

export interface BlockPosition {
  x: number
  y: number
  w: number
  h: number
} 