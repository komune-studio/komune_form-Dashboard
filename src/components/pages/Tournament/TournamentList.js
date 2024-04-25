import { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { ButtonGroup } from 'react-bootstrap';
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
	];

	useEffect(() => {
		getTournamentsData();
	}, []);

	return (
		<Container fluid>
			<div
				style={{
					background: Palette.BACKGROUND_DARK_GRAY,
					color: 'white',
				}}
				className="card-stats mb-4 mb-xl-0 px-4 py-3"
			>
				{/* Page title */}
				<div className="mb-4">
					<div
						className="mb-3"
						style={{ fontWeight: 'bold', fontSize: '1.1em' }}
					>
						Tournament List
					</div>
				</div>

				{/* Page content */}
				<div>
					{/* Tournament category selector */}
					<div>
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

					{/* Tournament list */}
				</div>
			</div>
		</Container>
	);
}
