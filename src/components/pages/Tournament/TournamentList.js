import { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { ButtonGroup, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Flex, Spin, Button as AntButton } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import swal from 'components/reusable/CustomSweetAlert';
import CustomTable from 'components/reusable/CustomTable';
import Palette from 'utils/Palette';
import TournamentModel from 'models/TournamentModel';
import Helper from 'utils/Helper';

export default function TournamentList() {
	const [tournaments, setTournaments] = useState({});
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const tournamentsDataFormatter = (data) => {
		let formatted = {};

		data.map((item) => {
			if (item.type in formatted) {
				formatted[item.type].push(item);
			} else {
				formatted[item.type] = [item];
			}
		});

		return formatted;
	};

	const getTournamentsData = async () => {
		setLoading(true);

		try {
			let result = await TournamentModel.getAll();
			let formattedResult = tournamentsDataFormatter(result);
			setTournaments(formattedResult);
			setCategory([...Object.keys(formattedResult)][0]);
			setLoading(false);
		} catch (e) {
			swal.fireError({
				text:
					e?.error_message || 'Error while fetching tournaments data',
			});
			setLoading(false);
		}
	};

	const tableColumnFormat = [
		{
			id: 'start_date',
			label: 'DATE',
			filter: false,
			render: (row) => {
				return (
					<>{moment(row.start_date).format('dddd, DD MMMM YYYY')}</>
				);
			},
		},
		{
			id: 'name',
			label: 'TITLE',
			filter: true,
		},
		{
			id: 'model',
			label: 'MODEL',
			filter: true,
		},
	];

	useEffect(() => {
		getTournamentsData();
	}, []);

	return (
		<>
			<Container fluid>
				<div
					style={{
						background: Palette.BACKGROUND_DARK_GRAY,
						color: 'white',
					}}
					className="card-stats mb-4 mb-xl-0 px-4 py-3"
				>
					<Flex
						className="mb-1"
						justify={'space-between'}
						align={'center'}
					>
						{/* Page title */}
						<div
							className="mb-3"
							style={{ fontWeight: 'bold', fontSize: '1.1em' }}
						>
							Tournament List
						</div>
						{/* Create new tournament button */}
						<AntButton
							size={'middle'}
							type={'primary'}
							onClick={() => setShowModal(true)}
						>
							Tambah Turnamen
						</AntButton>
					</Flex>
					{/* Page content */}
					<div>
						{/* Tournament category selector */}
						<div className="mb-5">
							<ButtonGroup aria-label="Basic example">
								{[...Object.keys(tournaments)].map(
									(item, index) => (
										<button
											key={index}
											className={`btn ${
												category === item
													? 'btn-primary-tab'
													: 'btn-default-tab'
											}`}
											onClick={() => setCategory(item)}
										>
											{Helper.toTitleCase(item)}
										</button>
									)
								)}
							</ButtonGroup>
						</div>

						{loading ? (
							<Flex justify="center" align="center">
								<Spin />
							</Flex>
						) : (
							<CustomTable
								data={
									tournaments[category]
										? tournaments[category]
										: []
								}
								columns={tableColumnFormat}
								showFilter={true}
								pagination={true}
								searchText={''}
							/>
						)}
					</div>
				</div>
			</Container>
			<TournamentCreateModalForm
				isOpen={showModal}
				closeModal={() => setShowModal(false)}
			/>
		</>
	);
}

function TournamentCreateModalForm(props) {
	const [formData, setFormData] = useState({
		name: '',
		location: '',
		model: '',
		type: '',
		start_date: new Date(),
		end_date: new Date(),
		detail: '',
	});

	const updateFormData = (name, value) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleClose = () => {
		setFormData({
			name: '',
			location: '',
			model: '',
			type: '',
			start_date: new Date(),
			end_date: new Date(),
			detail: '',
		});
		
		props.closeModal();
	};

	const handleSubmit = async () => {
		try {
			let result = await TournamentModel.create(formData);
			swal.fire({text: 'Turnamen berhasil dibuat!', icon: 'success'});
			console.log(result);
			handleClose();
		} catch(e) {
			swal.fireError({text: e?.error_message || 'Gagal membuat turnamen'})
		}
	}

	return (
		<Modal
			size={'lg'}
			show={props.isOpen}
			backdrop="static"
			keyboard={false}
		>
			<Modal.Header>
				<Flex justify="space-between" align="center" className="w-100">
					<Modal.Title>Buat Turnamen</Modal.Title>
					<div onClick={handleClose} style={{ cursor: 'pointer' }}>
						<CloseOutlined style={{ color: '#FFF' }} />
					</div>
				</Flex>
			</Modal.Header>
			<Modal.Body>
				<Flex className="w-100 mb-3" gap={32}>
					<Flex vertical gap={12} className="flex-grow-1">
						<Flex vertical gap={8}>
							<Form.Label>Nama Turnamen</Form.Label>
							<Form.Control
								placeholder={'...'}
								value={formData.name}
								onChange={(e) =>
									updateFormData('name', e.target.value)
								}
							/>
						</Flex>
						<Flex vertical gap={8}>
							<Form.Label>Lokasi</Form.Label>
							<Form.Control
								placeholder={'...'}
								value={formData.location}
								onChange={(e) =>
									updateFormData('location', e.target.value)
								}
							/>
						</Flex>
						<Flex vertical gap={8}>
							<Form.Label>Model</Form.Label>
							<Form.Control
								placeholder={'...'}
								value={formData.model}
								onChange={(e) =>
									updateFormData('model', e.target.value)
								}
							/>
						</Flex>
					</Flex>
					<Flex vertical gap={12} className="flex-grow-1">
						<Flex vertical gap={8}>
							<Form.Label>Kategori</Form.Label>
							<Form.Control
								placeholder={'...'}
								value={formData.type}
								onChange={(e) =>
									updateFormData('type', e.target.value)
								}
							/>
						</Flex>
						<Flex vertical gap={8}>
							<Form.Label>Tanggal Mulai</Form.Label>
							<Form.Control
								placeholder={'DD/MM/YYYY'}
								type="date"
								value={formData.start_date}
								onChange={(e) =>
									updateFormData('start_date', e.target.value)
								}
							/>
						</Flex>
						<Flex vertical gap={8}>
							<Form.Label>Tanggal Selesai</Form.Label>
							<Form.Control
								placeholder={'DD/MM/YYYY'}
								type="date"
								value={formData.end_date}
								onChange={(e) =>
									updateFormData('end_date', e.target.value)
								}
							/>
						</Flex>
					</Flex>
				</Flex>
				<Flex className="mb-5" vertical gap={8}>
					<Form.Label>Deskripsi</Form.Label>
					<Form.Control
						placeholder={'...'}
						as="textarea"
						rows={7}
						value={formData.detail}
						onChange={(e) =>
							updateFormData('detail', e.target.value)
						}
					/>
				</Flex>
				<Flex gap={8} justify={'end'}>
					<AntButton
						className={'text-white'}
						type={'link'}
						size="sm"
						variant="outline-danger"
						onClick={handleClose}
					>
						Batal
					</AntButton>
					<AntButton type={'primary'} size="sm" variant="primary" onClick={handleSubmit}>
						Simpan
					</AntButton>
				</Flex>
			</Modal.Body>
		</Modal>
	);
}
