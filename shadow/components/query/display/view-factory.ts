import {TableView} from "@/components/query/display/views/table-view"


export interface QueryResult {
  rows: any[];
  columns: Array<{
      name: string;
      type: string;
    }>;
}


interface QueryResultView {
  Component: React.ComponentType<QueryResult>;
}
  
export class QueryViewFactory {
  private views: Map<string, QueryResultView>;

  constructor() {
    this.views = new Map();
    this.registerDefaultViews();
  }

  private registerDefaultViews() {
    this.views.set("table", new TableView());
  }

  getView(type: string): React.ComponentType<ViewProps> {
    const view = this.views.get(type);
    return view ? view.Component : this.views.get("table")!.Component;
  }
}
