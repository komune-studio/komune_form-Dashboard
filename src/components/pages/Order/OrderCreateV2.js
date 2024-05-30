import { Container } from 'reactstrap';
import { Col, Form, Row } from 'react-bootstrap';
import Palette from '../../../utils/Palette';
import Helper from 'utils/Helper';
import Iconify from '../../reusable/Iconify';
import swal from '../../reusable/CustomSweetAlert';
import React, { useEffect, useState } from 'react';
import { Button as AntButton } from 'antd';
import OrderModel from 'models/OrderModel';
import UserModel from 'models/UserModel';
import OrderCreateModel from 'models/OrderCreateModel';
import { useHistory } from 'react-router-dom';

let contentTimer;

export default function OrderCreateV2() {
	const history = useHistory();

	let [quantity, setQuantity] = useState([0, 0, 0]);
	let [scanTextInput, setScanTextInput] = useState('');
	let [scannedUser, setScannedUser] = useState(null);
	const [orderItems, setOrderItems] = useState([]);
	const [total, setTotal] = useState(0);

	const editValue = (value) => {
		setScanTextInput(value);

		clearTimeout(contentTimer);

		contentTimer = setTimeout(async () => {
			if (value.length > 100) {
				findUserByQR(value);
			}
		}, 300);
	};

	const resetValue = () => {
		setScanTextInput('');
		setQuantity([0, 0, 0]);
	};

	const onSubmit = async () => {
		try {
			let details = [];
			for (let qIndex in quantity) {
				let q = quantity[qIndex];
				if (q > 0) {
					details.push({ id: orderItems[qIndex].id, quantity: q });
				}
			}
			let result = await OrderModel.create({
				user_id: scannedUser.id,
				details,
			});
			swal.fire({
				title: `Success`,
				icon: 'success',
				text: 'QR payment success!',
			});
			history.push('/orders');
		} catch (e) {
			console.log('QR PAYMENT FAILED', e);
			swal.fireError({
				title: `Error`,
				text: e.error_message
					? e.error_message
					: 'Invalid request, please try again.',
			});
		}
	};

	const findUserByQR = async (value) => {
		try {
			let qr = await UserModel.processUserQR({
				token: value,
			});
			console.log('findUserByQR Sucess', qr);
			setScannedUser(qr);
		} catch (e) {
			console.log('findUserByQR Error', e);
			swal.fireError({
				title: `Error`,
				text: e.error_message
					? e.error_message
					: 'Invalid QR, please try again.',
			});
			resetValue();
		}
	};

	const getOrderItems = async () => {
		try {
			let result = await OrderCreateModel.getAll();
			setOrderItems(result);
		} catch (e) {
			swal.fireError({ text: e.error_message ? e.error_message : '' });
		}
	};

	useEffect(() => {
		getOrderItems();
	}, []);

	useEffect(() => {
		let sum = 0;

		if (orderItems.length > 0) {
			quantity.forEach((num, index) => {
				sum += orderItems[index].price * num;
			});
		}

		setTotal(sum);
	}, [quantity, orderItems]);

	return (
		<>
			<Container fluid style={{ color: 'white' }}>
				<Row>
					<Col
						md={12}
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginBottom: 20,
						}}
					>
						<div onClick={() => history.push('/orders')}>
							<Iconify
								icon={'material-symbols:arrow-back'}
							></Iconify>
						</div>
						<div style={{ flex: 1 }}>&nbsp;Pembayaran Baru</div>
					</Col>
					<Col>
						<div style={{ marginTop: 48, width: '60%' }}>
							<div>
								<div style={{ fontSize: 14 }}>
									Nominal penarikan Barcoin
								</div>
								<div
									style={{
										marginTop: 8,
										borderBottom: '1px solid #616161',
										fontSize: 16,
									}}
								>
									0
								</div>
							</div>
							<div style={{ marginTop: 24 }}>
								<div
									style={{
										display: 'grid',
										columnGap: 8,
										rowGap: 12,
										gridTemplateColumns: '1fr 1fr 1fr',
									}}
								>
									<OrderNominalContainer value={50000} />
									<OrderNominalContainer value={100000} />
									<OrderNominalContainer value={150000} />
									<OrderNominalContainer value={200000} />
									<OrderNominalContainer value={250000} />
									<OrderNominalContainer value={300000} />
								</div>
							</div>
                            <div style={{marginTop: 48}}>
                                <AntButton>ScanQR</AntButton>
                            </div>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}

function OrderNominalContainer({ value }) {
	return (
		<AntButton
			style={{
				flex: 1,
				paddingLeft: 16,
				paddingRight: 16,
				paddingTop: 4,
				paddingBottom: 4,
				borderRadius: 6,
				border: `1px solid ${Palette.WHITE_GRAY}`,
                backgroundColor: 'transparent',
                color: '#FFF'
			}}
		>
			{value}
		</AntButton>
	);
}
