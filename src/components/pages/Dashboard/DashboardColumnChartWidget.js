import { useEffect, useRef, useState } from 'react';
import { Flex } from 'antd';
import { Bar } from 'react-chartjs-2';
import DashboardWidgetContainer from './DashboardWidgetContainer';

export default function DashboardColumnChartWidget(props) {
	const [chartSize, setChartSize] = useState({});
	const containerRef = useRef();

	const chartData = {
		labels: ['January', 'January', 'January', 'January', 'January', 'January', 'January'],
		datasets: [
			{
				label: 'My First Dataset',
				data: [65, 59, 80, 81, 56, 55, 40],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(201, 203, 207, 0.2)',
				],
				borderColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)',
					'rgb(153, 102, 255)',
					'rgb(201, 203, 207)',
				],
				borderWidth: 1,
			},
		],
	};

	useEffect(() => {
		setChartSize({
			height: containerRef.current.clientHeight,
			width: containerRef.current.clientWidth,
		});

		console.log('CHART SIZE', {
			height: containerRef.current.clientHeight,
			width: containerRef.current.clientWidth,
		});
	}, [containerRef]);

	return (
		<DashboardWidgetContainer title={props.title}>
			<Flex flex={1} ref={containerRef}>
				<Bar data={chartData} height={chartSize?.height || 0} width={chartSize?.width || 0} />
			</Flex>
		</DashboardWidgetContainer>
	);
}
