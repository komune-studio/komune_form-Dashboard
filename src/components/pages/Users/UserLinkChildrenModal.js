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

export default function UserLinkChildrenModal({ isOpen, handleClose, userData }) {
	const [userChildren, setUserChildren] = useState([]);
	const [inputValue, setInputValue] = useState('');

	const getChildren = async () => {
		try {
			let result = await ChildrenModel.getByUserId(userData.id);
			let resultWithApexData = [];

			for (let user of result) {
				let apexData = await UserApex.getByNickname(user.child_apex_nickname);
				resultWithApexData.push({ ...user, apex_data: apexData });
			}

			setUserChildren(resultWithApexData);
		} catch (e) {
			console.log(e);
		}
	};

	const handleInputValueChange = (value) => {
		setInputValue(value);
	};

	const handleSubmit = async () => {
		try {
			let response = await ChildrenModel.create({
				user_id: userData.id,
				child_apex_nickname: inputValue,
			});

			message.success('Berhasil menambah child account untuk user!');
			setInputValue('');
			getChildren();
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
			getChildren();
		} else {
			setUserChildren([]);
			setInputValue('');
		}
	}, [isOpen]);

	return (
		<Modal show={isOpen} backdrop="static" keyboard={false}>
			<Modal.Header>
				<Modal.Title>Sambungkan Akun Children untuk {userData.username}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Flex vertical gap={32}>
					<Flex vertical gap={8} style={{ marginTop: 24 }}>
						<Form.Label style={{ fontWeight: 400 }}>Daftarkan Driver</Form.Label>
						<Flex gap={8}>
							<Form.Control
								value={inputValue}
								placeholder={'Masukkan apex nickname user'}
								onChange={(e) => handleInputValueChange(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSubmit();
									}
								}}
							/>
							<AntButton type={'primary'} disabled={!inputValue} onClick={handleSubmit}>
								Daftarkan
							</AntButton>
						</Flex>
					</Flex>
					<Flex vertical gap={8}>
						<div style={{ color: '#FFF' }}>Akun Terhubung</div>
						<Flex vertical gap={12}>
							{userChildren.map((child) => (
								<ChildrenListItem data={child} key={child.id} />
							))}
						</Flex>
					</Flex>
					<Flex justify="end" onClick={handleClose}>
						<div style={{ cursor: 'pointer', color: '#FFF', fontSize: 12 }}>Tutup</div>
					</Flex>
				</Flex>
			</Modal.Body>
		</Modal>
	);
}

function ChildrenListItem({ data }) {
	return (
		<Flex gap={8} align={'center'} style={{ padding: '8px 12px', backgroundColor: '#FFFFFF14', borderRadius: 4 }}>
			<div>
				<img
					src={data?.apex_data?.avatar_url || Avatar}
					alt="child-avatar"
					style={{ height: 48, width: 48, borderRadius: 999 }}
				/>
			</div>
			<Flex vertical style={{ color: '#FFF' }}>
				<div style={{ fontWeight: 700 }}>{data.child_apex_nickname}</div>
				<div style={{ fontSize: 12 }}>{data.apex_data.skill}</div>
			</Flex>
		</Flex>
	);
}
