import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Flex, Button as AntButton, Spin } from 'antd';
import moment from 'moment';
import Iconify from 'components/reusable/Iconify';
import TournamentModel from 'models/TournamentModel';
import Palette from 'utils/Palette';
import Helper from 'utils/Helper';

export default function TournamentDetail() {
	const [detail, setDetail] = useState({});
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { id } = useParams();

	const getTournamentDetail = async () => {
		setLoading(true);

		try {
			let result = await TournamentModel.getById(id);
			setDetail(result);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			console.log(e);
		}
	};

	useEffect(() => {
		getTournamentDetail();
	}, []);

	return (
		<>
			<Container fluid>
				<div
					style={{
						backgroundColor: Palette.BACKGROUND_DARK_GRAY,
						color: 'white',
					}}
					className="card-stats mb-4 mb-xl-0 px-4 py-3"
				>
					<Flex
						className="mb-1"
						justify={'space-between'}
						align={'center'}
					>
						{/* Page title & navigation back button */}
						<Flex
							gap={8}
							className="mb-3"
							style={{ fontWeight: 'bold', fontSize: '1.1em' }}
						>
							<div
								onClick={() => history.push('/tournament')}
								style={{ cursor: 'pointer' }}
							>
								<Iconify
									icon={'material-symbols:arrow-back'}
								></Iconify>
							</div>
							<div>Tournament Detail</div>
						</Flex>

						{/* Add new drivers button */}
						<AntButton size={'middle'} type={'primary'}>
							Tambah Driver
						</AntButton>
					</Flex>

					{loading ? (
						<Flex justify={'center'} align={'center'} className="mt-5">
                            <Spin />
                        </Flex>
					) : (
						<div className="mt-5">
							{/* Tournament detail */}
							<Flex vertical gap={16} className="w-75">
								<TournamentDetailItem
									title={'Nama Turnamen'}
									value={detail?.tournament?.name || ''}
								/>
								<TournamentDetailItem
									title={'Lokasi'}
									value={detail?.tournament?.location || ''}
								/>
								<TournamentDetailItem
									title={'Model'}
									value={detail?.tournament?.model || ''}
								/>
								<TournamentDetailItem
									title={'Kategori'}
									value={Helper.toTitleCase(
										detail?.tournament?.type || ''
									)}
								/>
								<TournamentDetailItem
									title={'Tanggal Mulai'}
									value={moment(
										detail?.tournament?.start_date || ''
									).format('dddd, DD MMMM YYYY')}
								/>
								<TournamentDetailItem
									title={'Tanggal Selesai'}
									value={moment(
										detail?.tournament?.end_date || ''
									).format('dddd, DD MMMM YYYY')}
								/>
								<TournamentDetailItem
									title={'Deskripsi'}
									value={Helper.toTitleCase(
										detail?.tournament?.detail || ''
									)}
								/>
							</Flex>
						</div>
					)}
				</div>
			</Container>
		</>
	);
}

function TournamentDetailItem({ title, value }) {
	return (
		<Flex justify={'start'} align={'center'}>
			<div style={{ flex: '1 1 0', alignSelf: 'start' }}>{title}</div>
			<div style={{ fontWeight: 'bold', flex: '2 2 0' }}>{value}</div>
		</Flex>
	);
}
