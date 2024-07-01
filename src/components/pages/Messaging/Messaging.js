import {Col, Form, Row} from "react-bootstrap";
import React, {useState} from "react";
import {Card, CardBody, Container} from "reactstrap";
import Palette from "../../../utils/Palette";
import {Button} from "antd";

export default function Messaging() {
    const [form, setForm] = useState({title: '', body: ''})

    const CustomField = ({title, onChange, rows}) => {
        return (
            <Form.Group className="mb-3">
                <Form.Label style={{fontSize: "0.8em"}}>{title}</Form.Label>
                <Form.Control as={rows && 'textarea'} rows={rows} onChange={(e) => onChange(e.target.value)} type="text" placeholder="Title"/>
            </Form.Group>
        )
    }

    const onSubmit = () => {

    }

    return (
        <Container fluid>
            <Card style={{background: Palette.BACKGROUND_DARK_GRAY, color: "white"}}
                  className="card-stats mb-4 mb-xl-0">
                <CardBody>
                    <Row className={'mb-4'}>
                        <Col className='mb-3' md={12}>
                            <div style={{fontWeight: "bold", fontSize: "1.1em"}}>Messaging</div>
                        </Col>
                    </Row>
                    <CustomField title={'Title'} onChange={(e) => setForm({...form, title: e.target.value})}/>
                    <CustomField title={'Body'} rows={4} as={'textarea'} value={form.body} onChange={(e) => setForm({...form, body: e.target.value})} type="text" placeholder="Body"/>
                    <div style={{display: 'flex', justifyContent: 'right'}}>
                        <Button type={'primary'} size="sm" variant="primary" onClick={onSubmit}>
                            {'Luncurkan'}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </Container>
    )
}