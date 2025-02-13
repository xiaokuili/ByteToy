
import { create } from 'zustand'

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
  searchDatasource: (keyword: string) => Promise<Document[]>
}

export const useDatasource = create<DocumentState>(() => ({
  datasources: [],
  addDatasource: (datasource: Document) => {
    addDatasource(datasource)
  },
  searchDatasource: (keyword: string) => {
    return searchDatasource(keyword)
  }
}))

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
          content: datasource.content ,
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

