import { useState, useEffect } from 'react';
import { Flex, Row, Col, Spin } from 'antd';
import { Container } from 'reactstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import Palette from 'utils/Palette';
import DashboardNumericMetricWidget from './DashboardNumericMetricWidget';
import DashboardColumnChartWidget from './DashboardColumnChartWidget';
import DashboardStackedColumnChartWidget from './DashboardStackedColumnChartWidget';
import DashboardDoughnutChartWidget from './DashboardDoughnutChartWidget';
import DashboardHeatmapWidget from './DashboardHeatmapWidget';
import TopUpHistoryModel from 'models/TopUpHistoryModel';

Chart.register(...registerables);

export default function Dashboard() {
	const [period, setPeriod] = useState('daily');
	const [loading, setLoading] = useState(false);
	const [topUpHistories, setTopUpHistories] = useState([]);
	const [income, setIncome] = useState();

	const initializeData = async () => {
		try {
			let topUpHistories = await TopUpHistoryModel.getAll();
			setTopUpHistories(topUpHistories);
			console.log('Top Up Histories', topUpHistories);
		} catch (e) {
			console.log(e);
		}
	};

	const filterDataByPeriod = () => {
		const today = moment();
		const lastWeek = moment().set({ hour: 0, minute: 0, second: 0 }).subtract(1, 'weeks');
		const lastMonth = moment().set({ hour: 0, minute: 0, second: 0 }).subtract(1, 'months');
		let filteredTopUpHistories = [];

		switch (period) {
			case 'monthly':
				filteredTopUpHistories = topUpHistories.filter(
					(topUp) => moment(topUp.created_at).isBetween(lastMonth, today, []) && topUp.status === 'SUCCESS'
				);
				break;
			case 'weekly':
				filteredTopUpHistories = topUpHistories.filter(
					(topUp) => moment(topUp.created_at).isBetween(lastWeek, today, []) && topUp.status === 'SUCCESS'
				);
				break;
			case 'daily':
			default:
				filteredTopUpHistories = topUpHistories.filter(
					(topUp) => today.isSame(moment(topUp.created_at), 'day') && topUp.status === 'SUCCESS'
				);
		}

		let totalIncome = 0;

		if (filteredTopUpHistories.length > 0) {
			totalIncome = filteredTopUpHistories.reduce(
				(accumulator, currentData) => accumulator + parseInt(currentData.price || 0),
				totalIncome
			);
		}

		console.log('TOTAL INCOME', totalIncome);
		setIncome(totalIncome);
	};

	useEffect(() => {
		setLoading(true);
		initializeData();
	}, []);

	useEffect(() => {
		filterDataByPeriod();
		setLoading(false);
	}, [topUpHistories, period]);

	if (loading) {
		return (
			<Container fluid>
				<Flex flex={1} justify="center" align="center" style={{ height: '100%', width: '100%' }}>
					<Spin size="large" />
				</Flex>
			</Container>
		);
	}

	return (
		<Container fluid>
			<div
				style={{ background: Palette.BACKGROUND_DARK_GRAY, color: 'white' }}
				className="card-stats mb-4 mb-xl-0 px-4 py-3"
			>
				<Flex justify={'space-between'} align={'center'} style={{ marginBottom: 32 }}>
					<div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Dashboard</div>
					<Row>
						<Col span={12}>
							<ButtonGroup aria-label="Basic example">
								<div
									className={`btn ${period === 'daily' ? 'btn-primary-tab' : 'btn-default-tab'}`}
									onClick={() => setPeriod('daily')}
								>
									Harian
								</div>
								<div
									className={`btn ${period === 'weekly' ? 'btn-primary-tab' : 'btn-default-tab'}`}
									onClick={() => setPeriod('weekly')}
								>
									Mingguan
								</div>
								<div
									className={`btn ${period === 'monthly' ? 'btn-primary-tab' : 'btn-default-tab'}`}
									onClick={() => setPeriod('monthly')}
								>
									Bulanan
								</div>
							</ButtonGroup>
						</Col>
					</Row>
				</Flex>
				<Row gutter={24}>
					<Col span={4}>
						<Flex gap={24} vertical style={{ height: '100%' }}>
							<DashboardNumericMetricWidget title={'Today Income'} mainNumber={income} />
							<DashboardNumericMetricWidget title={'Today Transaction'} />
						</Flex>
					</Col>
					<Col span={10}>
						<DashboardColumnChartWidget title={'Income Trends'} />
					</Col>
					<Col span={10}>
						<DashboardColumnChartWidget title={'Transaction Trends'} />
					</Col>
				</Row>
				<Row gutter={24} style={{ marginTop: 24 }}>
					<Col span={18}>
						<DashboardStackedColumnChartWidget title="Customer Purchasing Behaviour" />
					</Col>
					<Col span={6}>
						<DashboardDoughnutChartWidget title="Slots Available" />
					</Col>
				</Row>
				<Row gutter={24} style={{ marginTop: 24 }}>
					<Col span={24}>
						<DashboardHeatmapWidget title="Peak Hours" />
					</Col>
				</Row>
			</div>
		</Container>
	);
}
