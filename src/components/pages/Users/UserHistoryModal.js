import Modal from "react-bootstrap/Modal";
import {Button, Form, Row} from "react-bootstrap";
import { Tabs } from 'antd';
import {DatePicker, Spin, Upload as AntUpload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import CustomTable from "../../reusable/CustomTable";
import React, {useEffect, useState} from "react";
import LoyaltyShopModel from "../../../models/LoyaltyShopModel";
import OrderModel from "../../../models/OrderModel";
import TopUpHistoryModel from "../../../models/TopUpHistoryModel";
import topUpHistory from "../TopUp/TopUpHistory";
import User from "../../../models/UserModel";
import Helper from "../../../utils/Helper";
import moment from "moment";
import Iconify from "../../reusable/Iconify";
import Palette from "../../../utils/Palette";

export default function UserHistoryModal({isOpen, userData, onClose}){

    const [transactionHistory, setTransactionHistory] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [rideHistory, setRideHistory] = useState([]);

    const [userBalance, setUserBalance] = useState(0)
    const [rideBalance, setRideBalance] = useState(null)

    const [loading, setLoading] = useState(false)

    const columnsTopUp = [
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

    const columnsOrder = [
        {
            id: 'created_at',
            label: 'Tanggal & jam',
            filter: true,
            render: (row) => {
                return row?.created_at ? moment(row?.created_at).format('DD MMM YYYY, HH:mm') : '-';
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
        {
            id: 'notes',
            label: 'Catatan',
            filter: true,
            render: (row) => {
                return (
                    <>
                        {row.notes}
                    </>
                );
            },
        },
    ];

    const columnsRides = [
        {
            id: 'created_at',
            label: 'Tanggal & jam',
            filter: true,
            render: (row) => {
                return row?.created_at ? moment(row?.created_at).format('DD MMM YYYY, HH:mm') : '-';
            },
        },
        {
            id: 'total_rides',
            label: 'Rides Dipakai',
            filter: true,
            render: (row) => {
                return (
                    <>
                        <Iconify icon={'maki:racetrack'}></Iconify>
                        {Helper.formatNumber(row.total_rides || 0)}
                    </>
                );
            },
        },
        {
            id: 'currency',
            label: 'Jenis',
            filter: true,
            render: (row) => {
                return (
                    <>
                        {row.currency}
                    </>
                );
            },
        },
        {
            id: 'notes',
            label: 'Catatan',
            filter: true,
            render: (row) => {
                return (
                    <>
                        {row.notes}
                    </>
                );
            },
        },
    ];

    const handleClose = (refresh) => {
        onClose(refresh)
    }

    const fetchOrderHistory = async () => {
        setLoading(true);
        try {
            let result = await OrderModel.getUserBarcoinUsage(userData.id);
            console.log("value of", result);
            setOrderHistory(result);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    const fetchTransactionHistory = async () => {
        setLoading(true);
        try {
            let result = await TopUpHistoryModel.getByUserId(userData.id);
            setTransactionHistory(result)
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    const fetchUserBalance = async () => {
        setLoading(true);
        try {
            let result = await User.getUserBalance(userData.id);
            setUserBalance(result.balance)
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    const fetchRideBalance = async () => {
        setLoading(true);
        try {
            let result = await User.getUserRideBalance(userData.id);
            setRideBalance(result)
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    const fetchRideHistory = async () => {
        setLoading(true);
        try {
            let result = await OrderModel.getUserRideHistory(userData.id);
            setRideHistory(result)
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    const initializeData=()=>{
        fetchTransactionHistory()
        fetchOrderHistory()
        fetchUserBalance()
        fetchRideHistory()
        fetchRideBalance()
    }

    useEffect(() => {
        if(userData){
            initializeData()
        }else{
            setOrderHistory([])
            setTransactionHistory([])
            setRideHistory([])
            setUserBalance(0)
            setRideBalance(null)
        }
    }, [userData]);

    const items = [
        {
            key: '1',
            label: 'TopUp History',
            children: <CustomTable
                mode={'dark'}
                pagination={true}
                searchText={''}
                data={transactionHistory}
                columns={columnsTopUp}
            />,
        },
        {
            key: '2',
            label: 'Barcoins History',
            children: <CustomTable
                mode={'dark'}
                pagination={true}
                searchText={''}
                data={orderHistory}
                columns={columnsOrder}
            />,
        },
        {
            key: '3',
            label: 'Rides History',
            children: <CustomTable
                mode={'dark'}
                pagination={true}
                searchText={''}
                data={rideHistory}
                columns={columnsRides}
            />,
        },
    ];

    return (
        <>
            <Modal
                size={'xl'}
                show={isOpen}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Riwayat Transaksi</Modal.Title>
                </Modal.Header>
                <Modal.Body className={'py-3'}>
                    Saldo : {Helper.formatNumber(userBalance)}
                    <br/>Beginner Rides : {Helper.formatNumber(rideBalance?.BEGINNER_RIDES ?? 0)}
                    <br/>Advanced Rides : {Helper.formatNumber(rideBalance?.ADVANCED_RIDES ?? 0)}
                    <br/>Pro Rides : {Helper.formatNumber(rideBalance?.PRO_RIDES ?? 0)}
                    {/* <div className={'d-flex mb-4'}>
                        <p>Balance : <strong>10.999</strong></p>
                    </div> */}

                    <Tabs
                        // tabBarStyle={{
                        //     color : "green !i",
                        //     background : "blue"
                        // }}
                        style={{
                            color  :"white"
                        }}
                        defaultActiveKey="1" items={items} onChange={() => {
                    }}/>

                    <div className={"d-flex mt-5 flex-row justify-content-end"}>
                        <Button size="sm" variant="outline-danger" onClick={() => handleClose()}
                                style={{marginRight: '5px'}}>
                            Tutup
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}