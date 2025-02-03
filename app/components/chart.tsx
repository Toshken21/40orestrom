import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PriceComparisonChart = ({  normalWeeklyPrices, subsidizedWeeklyPrices }: {

    normalWeeklyPrices: number[];
    subsidizedWeeklyPrices: number[];
}) => {
  const [xAxisInterval, setXAxisInterval] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setXAxisInterval(12); // Show every 12th week on mobile
      } else if (window.innerWidth < 768) {
        setXAxisInterval(8); // Show every 8th week on tablet
      } else {
        setXAxisInterval(3); // Show every 3rd week on desktop
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const weeklyData = Array.from({ length: 52 }, (_, index) => ({
    week: `Uke ${index + 1}`,
    'Strømstøtte': normalWeeklyPrices[index],
    'Fast pris': subsidizedWeeklyPrices[index]
  }));

  return (
    <div className="w-full md:w-[80%] px-4 md:px-0 mx-auto mt-4 md:mt-8 space-y-4 md:space-y-8">
      <div className="h-[400px] md:h-[500px] bg-green-50 p-2 md:p-4">
        <h2 className="text-[24px] md:text-[32px] text-center text-green-800 mb-2 md:mb-4">
          Ukentlig prissammenligning i 2024
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weeklyData}
            margin={{
              top: 20,
              right: 5,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#93c5aa" />
            <XAxis
              dataKey="week"
              tick={{ fill: '#166534', fontSize: '12px' }}
              interval={xAxisInterval}
              angle={window.innerWidth < 768 ? -45 : 0}
              textAnchor={window.innerWidth < 768 ? "end" : "middle"}
              height={60}
            />
            <YAxis
              tick={{ fill: '#166534', fontSize: '12px' }}
              label={{
                value: 'NOK',
                angle: -90,
                position: 'insideLeft',
                fill: '#166534',
                fontSize: '14px'
              }}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f0fdf4',
                border: '1px solid rgb(121, 163, 22)',
                fontSize: '12px'
              }}
              wrapperStyle={{
                fontSize: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '10px'
              }}
            />
            <Line
              type="monotone"
              dataKey="Strømstøtte"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Fast pris"
              stroke="orange"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceComparisonChart;