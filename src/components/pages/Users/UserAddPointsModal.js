import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { message, Button as AntButton, Flex } from 'antd';
import swal from '../../reusable/CustomSweetAlert';
import User from '../../../models/UserModel';
import UserApex from '../../../models/UserApexModel';
import ChildrenModel from '../../../models/ChildrenAccountModel';
import Palette from 'utils/Palette';
import Avatar from '../../../assets/img/brand/avatar.png';
import LoyaltyHistory from '../LoyaltyShop/LoyaltyHistory';
import LoyaltyHistoryModel from 'models/LoyaltyHistoryModel';

export default function UserAddPointsModal({ isOpen, handleClose, userData }) {

	const [inputValue, setInputValue] = useState('');

	const handleInputValueChange = (value) => {
		setInputValue(value);
	};

	const handleSubmit = async () => {
		try {
			if(!parseInt(inputValue)){
				alert("Please enter valid number")
				return
			}
			await LoyaltyHistoryModel.addPoints(userData.id, parseInt(inputValue))
			swal.fire({
				icon:"success",
				title: `Success`,
				text: "Penambahan Berhasil",
				focusConfirm: true,
			});
			handleClose()
		} catch (e) {
			console.log(e);
			swal.fireError({
				title: `Error`,
				text: e.error_message ? e.error_message : 'Gagal untuk menghubungkan akun, silahkan coba lagi!',
				focusConfirm: true,
			});
		}
	};

	useEffect(() => {
		if (isOpen) {
		} else {
			setInputValue('');
		}
	}, [isOpen]);

	if (!userData) {
		return null;
	}

	return (
		<Modal show={isOpen} backdrop="static" keyboard={false}>

			<Modal.Body>
				<Flex vertical gap={18}>
					<Modal.Title style={{color : "white"}}>Tambahkan Loyalty Poin</Modal.Title>
					<Form.Control
						value={inputValue}
						placeholder={'Masukkan jumlah'}
						onChange={(e) => handleInputValueChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleSubmit();
							}
						}}
					/>
					<Flex justify="end">
						<AntButton
							style={{ marginRight: 10, color: "white" }}
							type="text"
							onClick={() => {
								handleClose();
							}}
						>
							Batal
						</AntButton>
						<AntButton
							type="primary"
							onClick={() => {
								handleSubmit()
							}}
						>
							Simpan
						</AntButton>
					</Flex>
				</Flex>
			</Modal.Body>
		</Modal>
	);
}