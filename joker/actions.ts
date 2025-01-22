'use server'

import { z } from 'zod'



export async function parseTemplate(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return {
        success: false,
        error: 'No file uploaded'
      }
    }

    // 读取文件内容
    const text = await file.text()

    // 简单返回文本内容
    return {
      success: true,
      data: text
    }

  } catch (error) {
    console.error('Failed to parse template:', error)
    return {
      success: false,
      error: 'Failed to parse template'
    }
  }
}