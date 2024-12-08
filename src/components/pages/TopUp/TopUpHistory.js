import React, { useState, useEffect } from "react"
import {
	Card,
	Row,
	CardBody,
	Container,
	Button,
	FormGroup,
	Label,
	Input
} from "reactstrap"
import { useHistory } from "react-router-dom"
import Iconify from "../../reusable/Iconify"
import {Col, Dropdown, Form} from "react-bootstrap"
import CustomTable from "../../reusable/CustomTable"
import Palette from "../../../utils/Palette"
import TopUp from "../../../models/TopUpModel"
import TopUpFormModal from "./TopUpFormModal"
import Helper from "../../../utils/Helper"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import TopUpTitleBar from "./TopUpTitleBar"
import TopUpHistoryModel from "../../../models/TopUpHistoryModel"
import moment from "moment/moment"
import { CSVLink } from "react-csv"
import {Flex} from "antd";
import dayjs from "dayjs";

const TopUpHistory = () => {
	const history = useHistory()
	const [loading, setLoading] = useState(false)
	const [dataSource, setDataSource] = useState([])
	const [openTopUpModal, setOpenTopUpModal] = useState(false)
	const [isNewRecord, setIsNewRecord] = useState(false)
	const [selectedTopUp, setSelectedTopUp] = useState(null)

	const [filterDateStart, setFilterDateStart] = useState(null)
	const [filterDateEnd, setFilterDateEnd] = useState(null)

	useEffect(()=>{
		let d = new Date()
		let dLastWeek = new Date()
		dLastWeek.setDate(d.getDate() - 7);
		setFilterDateStart(dayjs(dLastWeek).format("YYYY-MM-DD"))
		setFilterDateEnd(dayjs(d).format("YYYY-MM-DD"))
	},[])

	const headers = [
		{
			label: "ID Transaksi",
			key: "transactions.order_id"
		},
		{
			label: "User",
			key: "users.username"
		},
		{
			label: "Tipe Pembayaran",
			key: "transactions.payment_method"
		},
		{
			label: "Nama Paket",
			key: "package_name"
		},
		{
			label: "Jumlah Rupiah",
			key: "price"
		},
		{
			label: "Jumlah Top Up",
			key: "amount"
		},
		{
			label: "Tipe Top Up",
			key: "currency"
		},
		{
			label: "Status",
			key: "transactions.paid_status"
		},
		{
			label: "Waktu Transaksi",
			key: "Waktu Transaksi"
		}
	]
	const columns = [
		{
			id: "created_at",
			label: "Tanggal & jam",
			filter: true,
			render: (row) => {
				return row?.created_at
					? moment(row?.created_at).format("DD MMM YYYY, HH:mm")
					: "-"
			}
		},
		{
			id: "transaction_id",
			label: "ID Transaksi",
			filter: true,
			render: (row) => {
				return row?.transactions?.order_id
			}
		},
		{
			id: "user_id",
			label: "User",
			filter: true,
			render: (row) => {
				return row?.users?.username
			}
		},
		// {
		//     id: 'currency', label: 'Tipe Paket', filter: true,
		// },
		// {
		//     id: 'price', label: 'Jumlah top up', filter: true,
		//     render: (row => {
		//         return row?.price ? 'Rp.' + Helper.formatNumber(row.price) : 0
		//     })
		// },
		{
			id: "payment_method",
			label: "Tipe pembayaran",
			filter: true,
			render: (row) => {
				return row?.transactions?.payment_method
			}
		},
		{
			id: "package_name",
			dataIndex: "package_name",
			label: "Nama Paket",
			filter: true
		},
		{
			id: "price",
			label: "Nilai (Rp)",
			filter: true,
			render: (row) => {
				return (
					<>
						Rp{Helper.formatNumber(row.price || 0)}
					</>
				)
			}
		},
		{
			id: "amount",
			label: "Jumlah top up",
			filter: true,
			render: (row) => {
				return (
					<>
						{row?.currency === "COIN" ? (
							<div>
								<Iconify icon={"fluent-emoji-flat:coin"}></Iconify>
								{Helper.formatNumber(row.amount || 0)}
							</div>
						) : (
							<div>
								<Iconify icon={"maki:racetrack"}></Iconify>
								{Helper.formatNumber(row.amount || 0)}
							</div>
						)}
					</>
				)
			}
		},

		{
			id: "status",
			label: "Status",
			filter: true,
			render: (row) => {
				return row?.transactions?.paid_status === "SETTLEMENT" ||
					row?.transactions?.paid_status === "CAPTURE" ||
					row?.transactions?.paid_status === "APPROVED" ? (
					<span style={{ color: Palette.THEME_GREEN }}>
						<Iconify icon={"lets-icons:check-fill"}></Iconify>{" "}
						{row?.transactions?.paid_status}
					</span>
				) : (
					<span style={{ color: Palette.THEME_RED }}>
						<Iconify icon={"carbon:close-filled"}></Iconify>{" "}
						{row?.transactions?.paid_status}
					</span>
				)
			}
		}
	]

	const initializeData = async () => {
		setLoading(true)
		try {
			let result = await TopUpHistoryModel.getAll(filterDateStart, filterDateEnd)
			console.log("isi res", result)
			setDataSource(result.map(obj=>{
				return {
					...obj,
					"Waktu Transaksi" : new moment(obj.created_at).format("dddd, MMMM Do YYYY, HH:mm")
				}
			}))
			setLoading(false)
		} catch (e) {
			console.log("masuk sinih", e)
			setLoading(false)
		}
	}

	useEffect(() => {
		if(filterDateStart && filterDateEnd){
			initializeData()
		}
	}, [filterDateEnd, filterDateStart])

	return (
		<>
			<Container fluid>
				<Card
					style={{ background: Palette.BACKGROUND_DARK_GRAY, color: "white" }}
					className="card-stats mb-4 mb-xl-0"
				>
					<CardBody>
						<TopUpTitleBar />


						<div style={{float: "right", display: "flex", flexDirection: "row", alignItems: "center"}}>
							<small style={{marginRight : 10}}>
								Filter Tanggal
							</small>
							<Flex>
								{/*<Form.Label><small>Filter Mulai</small></Form.Label>*/}
								<Form.Control
									placeholder={'DD/MM/YYYY'}
									type="date"
									value={filterDateStart}
									onChange={(e) => setFilterDateStart(e.target.value)}
								/>
							</Flex>

							<Flex>
								{/*<Form.Label><small>Filter Selesai</small></Form.Label>*/}
								<Form.Control
									placeholder={'DD/MM/YYYY'}
									type="date"
									value={filterDateEnd}
									onChange={(e) => setFilterDateEnd(e.target.value)}
								/>
							</Flex>

							{/* <Button className={'ml-3 bg-transparent text-white'}><Iconify
                                icon={'mdi:filter'}></Iconify> Export</Button> */}
							<CSVLink
								headers={headers}
								filename={
									"Top-up History - " +
									new moment().format("dddd, MMMM Do YYYY, HH:mm") +
									".csv"
								}
								data={dataSource.map(obj => {
									// console.log("DDSS", dataSource)
									return {
										...obj,
										"Waktu Transaksi": new moment(obj.created_at).format("dddd, MMMM Do YYYY, HH:mm")
									}
								})}
							>
								<Button className={"ml-1 bg-transparent text-white"}>
									<Iconify icon={"mdi:download"}></Iconify> Export
								</Button>
							</CSVLink>
						</div>

						<CustomTable
							showFilter={true}
							pagination={true}
							searchText={""}
							data={dataSource}
							columns={columns}
						/>
					</CardBody>
				</Card>
			</Container>
			<TopUpFormModal
				isOpen={openTopUpModal}
				isNewRecord={isNewRecord}
				topUpData={selectedTopUp}
				close={async (refresh) => {
					if (refresh) {
						await initializeData()
					}
					setOpenTopUpModal(false)
				}}
			/>
		</>
	)
}

export default TopUpHistory
