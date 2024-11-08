


interface QueryResult {
    rows: any[];
    columns: Array<{
      name: string;
      type: string;
    }>;
}

interface ViewProps {
    data: QueryResult;
  }
  
  interface QueryResultView {
    Component: React.ComponentType<ViewProps>;
  }
  
  export class QueryViewFactory {
    private views: Map<string, QueryResultView>;
  
    constructor() {
      this.views = new Map();
      this.registerDefaultViews();
    }
  
    getView(type: string): React.ComponentType<ViewProps> {
      const view = this.views.get(type);
      return view ? view.Component : this.views.get('table')!.Component;
    }
  }