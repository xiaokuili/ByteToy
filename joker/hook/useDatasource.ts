
import { create } from 'zustand'

// 只负责数据源的增删改查，不负责绑定到report
export interface Document {
  id: string
  content: string
  metadata: {
    url?: string
    name?: string
  }
}




interface DocumentState {
  addDatasource: (datasource: Document) => void
  isAdding: boolean
  addMessage: string
  addError: string | null


  searchDatasource: (keyword: string) => Promise<Document[]>
  isSearching: boolean
  searchMessage: string
  searchError: string | null

  generateDatasourceByAI: (title: string, history?: string, focus_modules?: string[]) => Promise<Document[]>
  isGenerating: boolean
  generateMessage: string
  generateError: string | null

}

export const useDatasource = create<DocumentState>((set) => ({
  isAdding: false,
  addMessage: '',
  addError: null,
  addDatasource: async (datasource: Document) => {
    set({ isAdding: true, addError: null });
    try {
      await addDatasource(datasource);
      set({ isAdding: false, addMessage: '添加成功' });
    } catch (err) {
      console.error('Error:', err);
      set({
        isAdding: false,
        addError: err instanceof Error ? err.message : '添加失败'
      });
    }
  },

  isSearching: false,
  searchMessage: '',
  searchError: null,
  searchDatasource: async (keyword: string) => {
    if (!keyword) {
      set({ searchError: '请输入关键词' });
      return [];
    }

    set({ isSearching: true, searchError: null });
    try {
      const results = await searchDatasource(keyword);
      set({ isSearching: false, searchMessage: '搜索完成' });
      return results;
    } catch (err) {
      console.error('Error:', err);
      set({
        isSearching: false,
        searchError: err instanceof Error ? err.message : '搜索失败'
      });
      return [];
    }
  },

  isGenerating: false,
  generateMessage: '',
  generateError: null,
  generateDatasourceByAI: async (title: string, history?: string, focus_modules: string[] = ['']) => {
    if (!title) {
      set({ generateError: '请输入标题' });
      return [];
    }

    set({ isGenerating: true, generateError: null });
    try {
      // TODO: Implement AI generation
      const results: Document[] = [];
      set({ isGenerating: false, generateMessage: '生成完成' });
      return results;
    } catch (err) {
      console.error('Error:', err);
      set({
        isGenerating: false,
        generateError: err instanceof Error ? err.message : '生成失败'
      });
      return [];
    }
  }
}));

const addDatasource = async (datasource: Document) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_AI_CORE_URL}/add-documents`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collection_name: "test_collection",
      documents: [
        {
          content: datasource.content,
          metadata: datasource.metadata,
          id: datasource.id
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

const searchDatasource = async (keyword: string): Promise<Document[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_AI_CORE_URL}/search`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword: keyword,
        collection_name: "test_collection"
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format');
    }

    return data.results.map((item: {
      content: string;
      metadata: { url?: string, name?: string };
      id: string;
    }) => ({
      id: item.id,
      url: item.metadata?.url || '',
      name: item.metadata.name || ''
    }));
  } catch (error) {
    console.error('Error fetching data source:', error);
    throw error;
  }
}
