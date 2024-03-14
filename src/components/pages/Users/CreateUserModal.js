import Modal from 'react-bootstrap/Modal';
import {DatePicker, Form, Input, message, Radio} from "antd";
import { Button } from 'react-bootstrap';
import FileUpload from "../../reusable/FileUpload";
import Swal from "sweetalert2";
import {useEffect, useState} from "react";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import UploadModel from "../../../models/UploadModel";
import UserModel from "../../../models/UserModel";

import PropTypes from "prop-types";
import Iconify from "../../reusable/Iconify";
import swal from "../../reusable/CustomSweetAlert";
import LoadingButton from "../../reusable/LoadingButton";

CreateUserModal.propTypes = {
    close: PropTypes.func,
    isOpen: PropTypes.bool,
    adminList: PropTypes.object
};


export default function CreateUserModal({isOpen, itemId, close, adminList}) {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [email, setEmail] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [fullName, setFullName] = useState("")
    const [gender, setGender] = useState()
    const [confirmPassword, setConfirmPassword] = useState("")

    const onSubmit = async () => {

        if(!password){
            swal.fireError({text: "Password Wajib diisi",})
            return
        }

        if(!username){
            swal.fireError({text: "Username Wajib diisi",})
            return
        }

        if (!confirmPassword) {
            swal.fireError({ text: "Konfirmasi Password Wajib diisi", })
            return
        }

        if (password !== confirmPassword) {
            swal.fireError({ text: "Password dan Konfirmasi Password tidak sama", })
            return
        }


        try {

            let result2 = await UserModel.create({
                username : username,
                password:password,
                gender : gender || 1,
                full_name : fullName,
                birth_date : new Date(birthDate),

            })

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
        close(refresh)
    }

    useEffect(()=>{
        reset()
    }, [isOpen])

    const reset = () =>{
        setUsername("")
        setPassword("")
        setConfirmPassword("")
    }

    return <Modal
        show={isOpen}
        backdrop="static"
        keyboard={false}
    >
        <Modal.Header>
            <Modal.Title>Buat User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form
                name="basic"
                layout={'vertical'}
                onFinish={onSubmit}
                autoComplete="off"
            >
                {/* Admin username */}
                <Form.Item
                    label="Username"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Mohon memasukkan nama user!',
                        },
                    ]}
                >
                    <Input value={username} onChange={(e) => { setUsername(e.target.value) }} />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Mohon memasukkan Email user!',
                        },
                    ]}
                >
                    <Input value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </Form.Item>

                <Form.Item
                    label="Full Name"
                    name="full_name"
                >
                    <Input value={fullName} onChange={(e) => { setFullName(e.target.value) }} />
                </Form.Item>

                <Form.Item
                    label="Birth Date"
                    name="birth_date"
                    type="date"
                >
                    <DatePicker
                        style={{width : "100%"}}
                        getPopupContainer={(triggerNode) => {
                            return triggerNode.parentNode;
                        }}
                        onChange={(value)=>{
                            setBirthDate(new Date(value))
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Gender"
                    name="gender"
                    type="radio"
                >
                    <Radio.Group onChange={() => {

                    }} value={gender}>
                        <Radio value={1}>Male</Radio>
                        <Radio value={0}>Female</Radio>

                    </Radio.Group>
                </Form.Item>

                {/* Password */}
                <Form.Item
                    label="Kata sandi"
                    name="password"
                >
                    <Input value={password} onChange={(e) => { setPassword(e.target.value) }} type='password'/>
                </Form.Item>

                {/* Confirm password */}
                <Form.Item
                    label="Konfirmasi kata sandi"
                    name="confirmPassword"

                >
                    <Input value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} type='password' />
                </Form.Item>
                <Form.Item>

                    <div className={"d-flex flex-row justify-content-end"}>
                        <Button size="sm" variant="outline-danger" onClick={()=>handleClose()} style={{marginRight: '5px'}}>
                            Batal
                        </Button>
                        <Button size="sm" variant="primary" type="submit">
                            Buat
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal.Body>
    </Modal>
}