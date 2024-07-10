import { Card, CardBody, Container, Row, Col, CardHeader } from 'reactstrap';
import Palette from '../../../utils/Palette';
import { Dropdown } from 'react-bootstrap';
import Iconify from '../../reusable/Iconify';
import CustomTable from '../../reusable/CustomTable';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Helper from '../../../utils/Helper';
import { Space, Button as AntButton } from 'antd';
import OrderModel from 'models/OrderModel';
import { Link } from 'react-router-dom';

export default function OrderList() {
	const [barcoinUsages, setBarcoinUsages] = useState([]);
	const [ridesUsages, setRidesUsages] = useState([]);
	const [openTopUpModal, setOpenTopUpModal] = useState(false);
	const [isNewRecord, setIsNewRecord] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedTopUp, setSelectedTopUp] = useState(null);

	const barcoinUsagesTableColumns = [
		{
			id: 'created_at',
			label: 'Tanggal & jam',
			filter: true,
			render: (row) => {
				return row?.created_at ? moment(row?.created_at).format('DD MMM YYYY, HH:mm') : '-';
			},
		},
		{
			id: 'user_id',
			label: 'User',
			filter: true,
			render: (row) => {
				return row?.users?.username;
			},
		},
		{
			id: 'total_coins',
			label: 'Koin Dipakai',
			filter: true,
			render: (row) => {
				return (
					<>
						<Iconify icon={'fluent-emoji-flat:coin'}></Iconify>
						{Helper.formatNumber(row.total_coins || 0)}
					</>
				);
			},
		},
	];

    const ridesUsagesTableColumns = [
        {
			id: 'created_at',
			label: 'Tanggal & jam',
			filter: true,
			render: (row) => {
				return row?.created_at ? moment(row?.created_at).format('DD MMM YYYY, HH:mm') : '-';
			},
		},
		{
			id: 'user_id',
			label: 'User',
			filter: true,
			render: (row) => {
				return row?.users?.username;
			},
		},
		{
			id: 'total_rides',
			label: 'Rides Digunakan',
			filter: true,
			render: (row) => {
				return (
					<>
						{row.total_rides}
					</>
				);
			},
		}, 
    ];

	const initializeData = async () => {
		setLoading(true);
		try {
			let barcoinUsagesData = await OrderModel.getAllBarcoinUsages();
			let ridesUsagesData = await OrderModel.getAllRidesUsages();

			setRidesUsages(ridesUsagesData);
			setBarcoinUsages(barcoinUsagesData);
		} catch (e) {
			console.log(e);
		}
		setLoading(false);
	};

	useEffect(() => {
		initializeData();
	}, []);

	return (
		<>
			<Container fluid>
				<Row>
					<Col md={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
						<Link to="/orders/create">
							<AntButton
								style={{
									top: '10px',
									width: 200,
									marginBottom: 20,
								}}
								onClick={() => {}}
								size={'middle'}
								type={'primary'}
							>
								Tambah Order
							</AntButton>
						</Link>
						<Card
							style={{ background: Palette.BACKGROUND_DARK_GRAY, color: 'white', width: '100%' }}
							className="card-stats mb-4 mb-xl-0"
						>
							<CardHeader style={{ background: Palette.BACKGROUND_DARK_GRAY, fontWeight: 700 }}>
								Barcoins Order History
							</CardHeader>
							<CardBody>
								<CustomTable
									showFilter={true}
									pagination={true}
									searchText={''}
									data={barcoinUsages}
									columns={barcoinUsagesTableColumns}
								/>
							</CardBody>
						</Card>
						<Card
							style={{ background: Palette.BACKGROUND_DARK_GRAY, color: 'white', width: '100%' }}
							className="card-stats mb-4 mb-xl-0"
						>
							<CardHeader style={{ background: Palette.BACKGROUND_DARK_GRAY, fontWeight: 700 }}>
								Rides Order History
							</CardHeader>
							<CardBody>
								<CustomTable
									showFilter={true}
									pagination={true}
									searchText={''}
									data={ridesUsages}
									columns={ridesUsagesTableColumns}
								/>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}
