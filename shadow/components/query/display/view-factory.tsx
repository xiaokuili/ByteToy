import { useViewProcessor } from "@/hook/use-view-processor";
import { views } from "./view-base";
import { useQueryExecution } from "@/hook/use-view-execution";
import React from "react";
import { Variable } from "@/types/base";
import { useQueryAndViewState } from "@/hook/use-visualization";
// 内部组件处理实际的渲染逻辑
export function ViewFactory({
  viewId,
  sqlContent,
  sqlVariables,
  databaseId,
  llmConfig,
}: {
  viewId: string;
  sqlContent: string;
  sqlVariables: Variable[];
  databaseId: string;
  llmConfig?: unknown;
}) {
  const currentViewIdRef = React.useRef<string>(viewId);
  const processingComplete = React.useRef(false);

  const {
    queryResult,
    queryError,
    lifecycle: queryLifecycle,
  } = useQueryExecution({
    sqlContent,
    sqlVariables,
    databaseId,
  });

  const { processedData, lifecycle: viewLifecycle } = useViewProcessor(
    viewId,
    queryResult,
    llmConfig
  );
  const { setIsExecuting } = useQueryAndViewState();

  React.useEffect(() => {
    if (queryLifecycle === "completed" && viewLifecycle === "completed") {
      setIsExecuting(false);
    }
  }, [queryLifecycle, viewLifecycle, setIsExecuting]);

  React.useEffect(() => {
    if (viewLifecycle === "completed") {
      currentViewIdRef.current = viewId;
      processingComplete.current = true;
    } else {
      processingComplete.current = false;
    }
  }, [viewId, viewLifecycle]);
  const ViewComponent = views.get(viewId);
  return (
    <>
      {queryError && <VisualizationErrorView error={queryError} />}
      {(queryLifecycle === "executing" || viewLifecycle === "executing") && (
        <LoadingView />
      )}
      {!queryError &&
        viewLifecycle !== "executing" &&
        (!processedData || Object.keys(processedData).length === 0) && (
          <EmptyDataView />
        )}
      {!queryError && !ViewComponent && <ViewNotFoundError viewId={viewId} />}
      {!queryError &&
        viewLifecycle !== "executing" &&
        ViewComponent &&
        processedData &&
        Object.keys(processedData).length > 0 &&
        processingComplete.current &&
        currentViewIdRef.current === viewId && (
          <ViewComponent.Component data={processedData} />
        )}
    </>
  );
}

export function ViewNotFoundError({ viewId }: { viewId: string }) {
  return (
    <div className='flex h-full w-full items-center justify-center p-8 text-red-500'>
      <div className='flex flex-col items-center gap-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-12 w-12'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <div className='text-lg font-medium'>View Not Found</div>
        <div className='text-center text-sm opacity-75'>
          The visualization view &quot;{viewId}&quot; could not be found
        </div>
      </div>
    </div>
  );
}

export function EmptyDataView() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50'>
      <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-10 w-10 text-muted-foreground/60 mb-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
          />
        </svg>
        <h3 className='text-lg font-semibold'>没有数据进行展示</h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          请输入SQL语句请求数据并进行展示
        </p>
      </div>
    </div>
  );
}

export function VisualizationErrorView({ error }: { error: string }) {
  return (
    <div className='flex h-full w-full items-center justify-center p-8 text-red-500'>
      <div className='flex flex-col items-center gap-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-12 w-12'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
        <div className='text-lg font-medium'>Visualization Error</div>
        <div className='text-center text-sm opacity-75'>{error}</div>
      </div>
    </div>
  );
}

export function LoadingView() {
  return (
    <div className='flex h-full w-full items-center justify-center p-8 text-gray-500'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500' />
        <div className='text-lg font-medium'>Loading</div>
        <div className='text-sm opacity-75'>
          Please wait while we process your request...
        </div>
      </div>
    </div>
  );
}
