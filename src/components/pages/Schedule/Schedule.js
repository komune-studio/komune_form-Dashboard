import { useState } from 'react';
import moment from 'moment';
import { Button as AntButton, Flex, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Palette from 'utils/Palette';
import Iconify from 'components/reusable/Iconify';
import swal from 'components/reusable/CustomSweetAlert';
import UserModel from 'models/UserModel';
import TournamentModel from 'models/TournamentModel';

// Data-data sementara (tunggu API)
const SCHEDULES = [
	{ backgroundColor: '#D1E7DD', color: '#0F5132' },
	{ backgroundColor: Palette.LIGHT_GRAY, color: Palette.WHITE_GRAY },
	{ backgroundColor: '#FFF3CD', color: '#664D03' },
	{ backgroundColor: '#F8D7DA', color: '#842029' },
	{ backgroundColor: '#D1E7DD', color: '#0F5132' },
	{ backgroundColor: Palette.LIGHT_GRAY, color: Palette.WHITE_GRAY },
];

const OPERATIONAL_HOURS = [
	'08:00',
	'09.00',
	'10.00',
	'11.00',
	'12.00',
	'13.00',
	'14.00',
	'15.00',
	'16.00',
	'17.00',
	'18.00',
	'19.00',
	'20.00',
	'21.00',
	'22.00',
];

const DATE_HEADER_HEIGHT = 25;

const SKILL_LEVEL = ['BEGINNER', 'ADVANCED', 'PRO'];

export default function Schedule() {
	const [modalSetting, setModalSetting] = useState({
		isOpen: false,
		isCreateMode: true,
	});

	return (
		<>
			<div
				className="container-fluid"
				style={{ color: '#FFF', fontFamily: 'Helixa', flex: 1 }}
			>
				{/* Schedule title & pagination */}
				<div className="d-flex justify-content-between align-items-center">
					{/* Schedule title */}
					<div className="font-weight-bold" style={{ fontSize: 20 }}>
						Schedule
					</div>
					{/* Schedule pagination & create button */}
					<div
						className="d-flex font-weight-bold align-items-center justify-content-center"
						style={{ fontSize: 12, gap: 8 }}
					>
						<div>
							<AntButton
								type={'primary'}
								onClick={() =>
									setModalSetting({
										isOpen: true,
										isCreateMode: true,
									})
								}
							>
								Buat Sesi
							</AntButton>
						</div>
						<div
							className="d-flex align-items-center justify-content-center"
							style={{
								gap: 10,
								padding: '6px 8px 6px 12px',
								backgroundColor: Palette.LIGHT_GRAY,
								borderRadius: 4,
							}}
						>
							<div>Jan 2024</div>
							<div
								className="border"
								style={{ borderRadius: 4, padding: '2px 8px' }}
							>
								W5
							</div>
						</div>
						<div
							className="d-flex align-items-center justify-content-center"
							style={{ gap: 12 }}
						>
							<button className="btn p-0">
								<Iconify
									icon="mdi:chevron-left"
									size={16}
									color="#FFF"
								/>
							</button>
							<button className="btn p-0">
								<Iconify
									icon="mdi:chevron-right"
									size={16}
									color="#FFF"
								/>
							</button>
						</div>
					</div>
				</div>
				{/* Schedule table */}
				<div className="d-flex" style={{ marginTop: 34, flex: 1 }}>
					{/* Table y-axis header */}
					<div className="d-flex flex-column">
						<div
							style={{
								height: DATE_HEADER_HEIGHT,
								marginBottom: 8,
							}}
						></div>
						{/* Loop for getting the y-axis of the table (every hour in a day) */}
						{OPERATIONAL_HOURS.map((text, index) => (
							<div
								className="d-flex justify-content-center align-items-start font-weight-bold"
								style={{
									flex: 1,
									padding: '2px 4px',
									marginRight: 12,
									fontSize: 12,
									fontWeight: 700,
								}}
								key={index}
							>
								{text}
							</div>
						))}
					</div>
					{/* Loop through all dates in current section */}
					{getPastWeekDates().map((date, index) => (
						<div
							className="d-flex flex-column"
							style={{
								flex: 1,
							}}
							key={index}
						>
							{/* Table x-axis header || current date */}
							<div
								className="d-flex align-items-center justify-content-center"
								style={{
									fontSize: 14,
									fontWeight: 700,
									color: Palette.INACTIVE_GRAY,
									height: DATE_HEADER_HEIGHT,
									marginBottom: 8,
								}}
							>
								{moment(date).format('LL')}
							</div>
							{/* Loop for getting schedule data from each hour in current date  */}
							{OPERATIONAL_HOURS.map((text, index) => (
								<div
									className="d-flex flex-column"
									style={{
										gap: 8,
										padding: '4px 4px',
										border: '1px solid #404040',
										flex: 1,
									}}
									key={index}
								>
									{/* Loop for getting schedule data in current hour */}
									{SCHEDULES.map((item, index) => (
										<ScheduleItem
											key={index}
											backgroundColor={
												item.backgroundColor
											}
											color={item.color}
											setModalSetting={setModalSetting}
										/>
									))}
								</div>
							))}
						</div>
					))}
				</div>
			</div>
			<ScheduleActionModal
				isOpen={modalSetting.isOpen}
				isCreateMode={modalSetting.isCreateMode}
				handleClose={() =>
					setModalSetting({ ...modalSetting, isOpen: false })
				}
			/>
		</>
	);
}

function ScheduleItem(props) {
	return (
		<div
			className="d-flex justify-content-between align-items-center"
			style={{
				padding: '4px 8px',
				backgroundColor: props.backgroundColor,
				color: props.color,
				borderRadius: 24,
				fontSize: 10,
				cursor: 'pointer',
			}}
			onClick={() =>
				props.setModalSetting({
					isOpen: true,
					isCreateMode: false,
				})
			}
		>
			<div className="font-weight-bold">Beginner</div>
			<div>4 slot(s) available</div>
		</div>
	);
}

function ScheduleActionModal({
	isOpen,
	isCreateMode,
	handleClose,
	handleSubmit,
}) {
	const [createFormData, setCreateFormData] = useState({
		startTime: '',
		duration: '',
		skillLevel: '',
	});
	const [registerInputValue, setRegisterInputValue] = useState('');
	const [registeredDrivers, setRegisteredDrivers] = useState([]);
	const [driverSearchResult, setDriverSearchResult] = useState(null);

	const resetForms = () => {
		setCreateFormData({
			startTime: '',
			duration: '',
			skillLevel: '',
		});

		setRegisteredDrivers([]);
	};

	const resetRegisterForm = () => {
		setRegisterInputValue('');
		setDriverSearchResult(null);
	};

	const handleDriverRegistrationInputChange = async (value) => {
		try {
			setRegisterInputValue(value);

			let getUserData;
			clearTimeout(getUserData);

			getUserData = setTimeout(async () => {
				if (value.length > 100) {
					let result = await UserModel.processUserQR({
						token: value,
					});
					setRegisteredDrivers([...registeredDrivers, result]);
					setTimeout(() => setRegisterInputValue(''), 300)
				}
			}, 300);
		} catch (e) {
			swal.fireError({
				title: `Error`,
				text: e.error_message
					? e.error_message
					: 'Invalid credential, please try again.',
			});
		}
	};

	const handleDriverSearch = async () => {
		try {
			let result = await UserModel.getByUsername(registerInputValue);
			if (!result || result.length < 1) {
			}

			setDriverSearchResult(result);
		} catch (e) {
			console.log(e);
			swal.fireError({
				title: 'Error',
				text: e.error_message
					? e.error_message
					: 'Unable to process search request!',
			});
		}
	};

	return (
		<Modal size={'lg'} show={isOpen} backdrop="static" keyboard={false}>
			<Modal.Header>
				<div className={'d-flex w-100 justify-content-between'}>
					<Modal.Title>
						{isCreateMode ? 'Buat Sesi' : `Daftarkan Driver`}
					</Modal.Title>
					<AntButton
						onClick={() => {
							resetForms();
							handleClose();
						}}
						style={{
							position: 'relative',
							top: -5,
							color: '#fff',
							fontWeight: 800,
						}}
						type="link"
						shape="circle"
						icon={<CloseOutlined />}
					/>
				</div>
			</Modal.Header>
			<Modal.Body>
				<Flex vertical gap={12}>
					{isCreateMode ? (
						<>
							<Flex vertical gap={8}>
								<Form.Label>Waktu Mulai</Form.Label>
								<Form.Control
									placeholder={'...'}
									type="date"
									value={createFormData.startTime}
									onChange={(e) =>
										setCreateFormData({
											...createFormData,
											startTime: e.target.value,
										})
									}
								/>
							</Flex>
							<Flex vertical gap={8}>
								<Form.Label>Durasi (menit)</Form.Label>
								<Form.Control
									placeholder={0}
									type="number"
									value={createFormData.duration}
									onChange={(e) =>
										setCreateFormData({
											...createFormData,
											duration: e.target.value,
										})
									}
								/>
							</Flex>
							<Flex vertical gap={8}>
								<Form.Label>Level Skill</Form.Label>
								<Form.Select
									className="form-control"
									value={createFormData.skillLevel}
									onChange={(e) =>
										setCreateFormData({
											...createFormData,
											skillLevel: e.target.value,
										})
									}
								>
									{SKILL_LEVEL.map((skill) => (
										<option key={skill} value={skill}>
											{skill}
										</option>
									))}
								</Form.Select>
							</Flex>
						</>
					) : (
						<>
							{/* Driver Regisration Form - Action Buttons */}
							<Flex vertical gap={8}>
								<Form.Label style={{ fontWeight: 700 }}>
									SEARCH
								</Form.Label>
								<Flex gap={8}>
									<Form.Control
										value={registerInputValue}
										placeholder={
											'Scan QR atau masukkan username user'
										}
										onChange={(e) =>
											handleDriverRegistrationInputChange(
												e.target.value
											)
										}
									/>
									<AntButton
										type={'primary'}
										onClick={handleDriverSearch}
									>
										Cari Driver
									</AntButton>
									<AntButton
										type={'primary'}
										disabled={!driverSearchResult}
										onClick={() => {
											if (!driverSearchResult) {
												swal.fireError({
													title: 'Error',
													text: 'Search value is empty!',
												});
											}

											setRegisteredDrivers([
												...registeredDrivers,
												driverSearchResult,
											]);
											resetRegisterForm();
										}}
									>
										Tambah Driver
									</AntButton>
								</Flex>
							</Flex>

							{/* Search Driver Result */}
							{driverSearchResult ? (
								<Flex
									style={{
										color: '#FFF',
										backgroundColor: '#FFFFFF14',
										padding: '8px 12px',
										borderRadius: 8,
									}}
									justify="space-between"
									align="center"
								>
									<Flex
										gap={8}
										justify="center"
										align="center"
									>
										<div>
											<img
												src={
													driverSearchResult.avatar_url
												}
												height={48}
												width={48}
											/>
										</div>
										<Flex vertical>
											<div style={{ fontWeight: 700 }}>
												{driverSearchResult.username}
											</div>
											<div
												style={{
													font: 10,
													color: Palette.INACTIVE_GRAY,
												}}
											>
												{driverSearchResult.email}
											</div>
										</Flex>
									</Flex>
									<Flex>
										<div style={{ fontWeight: 700 }}>
											PRO
										</div>
									</Flex>
								</Flex>
							) : null}

							{/* Registered Drivers List */}
							{registeredDrivers.length > 0 ? (
								<Flex vertical gap={8}>
									<div
										style={{
											color: '#FFF',
											fontWeight: 700,
											marginTop: 24,
										}}
									>
										REGISTERED DRIVER
									</div>
									{registeredDrivers.map((driver, index) => (
										<RegisteredDriversListItem
											key={driver.id}
											driver={driver}
											registeredDrivers={
												registeredDrivers
											}
											setRegisteredDrivers={
												setRegisteredDrivers
											}
										/>
									))}
								</Flex>
							) : null}
						</>
					)}
				</Flex>

				<Flex className="mt-5" justify={'end'}>
					<AntButton
						className={'text-white'}
						type={'link'}
						size="sm"
						variant="outline-danger"
						onClick={() => {
							resetForms();
							handleClose();
						}}
						style={{ marginRight: '5px' }}
					>
						Batal
					</AntButton>
					<AntButton
						type={'primary'}
						size="sm"
						variant="primary"
						onClick={() => {
							handleSubmit();
						}}
					>
						{isCreateMode ? 'Simpan' : 'Ubah'}
					</AntButton>
				</Flex>
			</Modal.Body>
		</Modal>
	);
}

function RegisteredDriversListItem({
	driver,
	registeredDrivers,
	setRegisteredDrivers,
}) {
	return (
		<Flex
			style={{
				color: '#FFF',
				backgroundColor: Palette.BACKGROUND_DARK_GRAY,
				padding: '8px 12px',
				borderRadius: 8,
			}}
			justify={'space-between'}
			align={'center'}
			flex={1}
		>
			<Flex gap={8} justify="center" align="center">
				<div>
					<img src={driver.avatar_url} height={48} width={48} />
				</div>
				<Flex vertical>
					<div style={{ fontWeight: 700 }}>{driver.username}</div>
					<div style={{ font: 10, color: Palette.INACTIVE_GRAY }}>
						{driver.email}
					</div>
				</Flex>
			</Flex>
			<div
				style={{
					color: Palette.THEME_RED,
					fontSize: 12,
					cursor: 'pointer',
				}}
				onClick={() => {
					setRegisteredDrivers(
						registeredDrivers.filter(
							(item) => item.id !== driver.id
						)
					);
				}}
			>
				Hapus
			</div>
		</Flex>
	);
}

function getPastWeekDates() {
	const result = [];

	for (let i = 0; i < 7; i++) {
		let date = new Date();
		date.setDate(date.getDate() - i);
		result.push(date);
	}

	return result;
}

// NOTE --> ini function buat create tournament, numpang taruh di file ini
const createTournament = async () => {
	try {
		const result = await TournamentModel.create({
			name: 'Pitstop Grand Finale',
			location: 'Mall of Indonesia',
			model: 'SODI SX9',
			start_date: moment().toISOString(),
			end_date: moment().toISOString(),
			detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sapien sapien, elementum et lacinia placerat, lobortis non justo. Maecenas consequat vel ante non mollis.',
			type: 'classic',
		});
		console.log(result);
		swal.fire({ text: 'Data berhasil dibuat', icon: 'success' });
	} catch (e) {
		swal.fireError(e);
	}
};

// NOTE --> ini function buat create tournament detail, numpang taruh di file ini
const createTournamentDetail = async (tournamentId) => {
	try {
		const result = await TournamentModel.createDetail({
			body: {
				username: 'michael',
				time_in_millisecond: 1200,
				laps: 20,
			},
			id: tournamentId,
		});
		console.log(result);
		swal.fire({ text: 'Data detail berhasil dibuat', icon: 'success' });
	} catch (e) {
		swal.fireError(e);
	}
};
