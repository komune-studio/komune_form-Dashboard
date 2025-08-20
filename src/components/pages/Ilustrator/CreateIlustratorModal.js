import Modal from 'react-bootstrap/Modal';
import { Button, Form, Input, message } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import swal from "../../reusable/CustomSweetAlert";


CreateIlustratorModal.propTypes = {
    close: PropTypes.func,
    isOpen: PropTypes.bool,
};


export default function CreateIlustratorModal({ isOpen, itemId, close }) {
    const [form] = Form.useForm();

    const onSubmit = async (values) => {

        try {
            let body = {
                name: values.name,
                email: values.email,
                phone_number: values.phoneNumber,
            }
            // let result2 = await AdminModel.create({
            //     password,
            //     name: name,
            // })

            console.log("Body's body: ", body)
            message.success('Berhasil menambahkan Admin')
            handleClose(true)


        } catch (e) {
            console.log(e)
            let errorMessage = "An Error Occured"
            await swal.fire({
                title: 'Error',
                text: e.error_message ? e.error_message : "An Error Occured",
                icon: 'error',
                confirmButtonText: 'Okay'
            })
        }
    }

    const handleClose = (refresh) => {
        close(refresh);
        form.resetFields();
    }

    return <Modal
        show={isOpen}
        backdrop="static"
        keyboard={false}
    >
        <Modal.Header>
            <Modal.Title>Buat Translator</Modal.Title>
            <Button 
                onClick={handleClose} 
                style={{ position: 'relative', top: -5, color: '#fff', fontWeight: 800 }} type="link" shape="circle"
                icon={<CloseOutlined />} 
            />
        </Modal.Header>
        <Modal.Body>
            <Form
                form={form}
                name="basic"
                layout={'vertical'}
                onFinish={onSubmit}
                autoComplete="off"
                validateTrigger= "onSubmit"
            >
                <Form.Item
                    label="Nama"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Mohon memasukkan nama!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Mohon memasukkan email!',
                        },
                        {
                            type: 'email',
                            message: 'Email tidak valid.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                        {
                            required: true,
                            message: 'Mohon memasukkan Nomor HP!',
                        },
                        {
                            pattern: /^[0-9]+$/,
                            message: 'Nomor HP hanya bisa angka.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <div className={"d-flex flex-row justify-content-end"}>
                        <Button  variant="outline-danger" onClick={handleClose} style={{ marginRight: '5px' }}>
                            Cancel
                        </Button>
                        <Button  htmlType="submit" type="primary">
                            Add
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal.Body>
    </Modal>
}