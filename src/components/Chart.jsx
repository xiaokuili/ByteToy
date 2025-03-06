import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const Chart = ({ data, config, ...props }) => {
  const chartRef = useRef(null);
  
  // 导出PNG的函数
  const exportToPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then(canvas => {
        // 创建下载链接
        const link = document.createElement('a');
        link.download = `chart-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };
  
  return (
    <div className="chart-container">
      <div ref={chartRef}>
        {/* 这里是您的Recharts图表代码 */}
        {/* ... existing chart code ... */}
      </div>
      <button 
        onClick={exportToPNG}
        className="export-btn"
      >
        导出PNG
      </button>
    </div>
  );
};

export default Chart; 