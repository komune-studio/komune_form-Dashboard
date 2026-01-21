import React, { useState, useEffect } from 'react';
import { useHistory, Link, Prompt } from 'react-router-dom';
import { 
  Button, 
  Flex, 
  message, 
  Spin, 
  Typography, 
  Form, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Divider,
  DatePicker,
  Switch
} from 'antd';
import { Card, CardBody, Container } from 'reactstrap';
import { Col, Row } from 'react-bootstrap';
import Palette from '../../../utils/Palette';
import Iconify from '../../reusable/Iconify';
import swal from '../../reusable/CustomSweetAlert';
import FormModel from 'models/VisitorModel';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

export default function VisitorFormPage({
  visitorData,
  disabled,
}) {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const [formDisabled, setFormDisabled] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentProfile, setCurrentProfile] = useState("Visitor");

  const onValuesChanged = (changedValues, allValues) => {
    if (changedValues.visitor_profile) {
      setCurrentProfile(changedValues.visitor_profile);
    }

    if (!visitorData) {
      const changed = Object.keys(allValues).some(key => {
        const value = allValues[key];
        if (value && value.toString().trim() !== '') {
          return true;
        }
        return false;
      });
      setHasChanges(changed);
      return;
    }

    const changed = Object.keys(allValues).some(key => {
      const currentValue = allValues[key];
      const originalValue = visitorData[key];
      
      if (key === 'checked_out_at') {
        return false;
      }
      
      if (Array.isArray(currentValue) || Array.isArray(originalValue)) {
        return JSON.stringify(currentValue) !== JSON.stringify(originalValue);
      }
      
      return currentValue !== originalValue;
    });
    
    setHasChanges(changed);
  };

  const onSubmit = async () => {
    setLoadingSubmit(true);
    try {
      // Validasi form
      await form.validateFields();
      
      let body = form.getFieldsValue();
      
      // Transformasi data jika perlu
      const validation = FormModel.validateVisitorData(body);
      if (!validation.isValid) {
        const errorMsg = Object.values(validation.errors).join(', ');
        message.error(`Validation errors: ${errorMsg}`);
        setLoadingSubmit(false);
        return;
      }

      let result;
      let msg;

      if (!visitorData) {
        // Create new visitor
        msg = 'Successfully added new Visitor';
        result = await FormModel.createVisitor(body);
      } else {
        // Update existing visitor
        msg = 'Successfully updated Visitor';
        result = await FormModel.updateVisitor(visitorData.id, body);
      }

      if (result && result.http_code === 200) {
        message.success(msg);
        history.push("/visitors");
      } else {
        throw new Error(result?.error_message || "Failed to save visitor");
      }
    } catch (error) {
      console.error("Error saving visitor:", error);
      let errorMessage = "An error occurred while saving visitor";
      
      await swal.fire({
        title: 'Error',
        text: error.error_message ? error.error_message : errorMessage,
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!visitorData || !visitorData.id) return;
      
      await swal.fire({
        title: 'Checkout Visitor',
        text: 'Are you sure you want to checkout this visitor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, checkout',
        cancelButtonText: 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const checkoutResult = await FormModel.checkoutVisitor(visitorData.id);
          if (checkoutResult && checkoutResult.http_code === 200) {
            message.success('Visitor checked out successfully');
            history.push("/visitors");
          }
        }
      });
    } catch (error) {
      console.error("Error checking out visitor:", error);
      message.error('Failed to checkout visitor');
    }
  };

  const handleDelete = async () => {
    try {
      if (!visitorData || !visitorData.id) return;
      
      await swal.fire({
        title: 'Delete Visitor',
        text: 'Are you sure you want to delete this visitor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: Palette.DANGER
      }).then(async (result) => {
        if (result.isConfirmed) {
          const deleteResult = await FormModel.deleteVisitor(visitorData.id);
          if (deleteResult && deleteResult.http_code === 200) {
            message.success('Visitor deleted successfully');
            history.push("/visitors");
          }
        }
      });
    } catch (error) {
      console.error("Error deleting visitor:", error);
      message.error('Failed to delete visitor');
    }
  };

  const profileOptions = FormModel.getVisitorProfileOptions();

  useEffect(() => {
    if (visitorData) {
      form.setFieldsValue({
        visitor_name: visitorData.visitor_name,
        phone_number: visitorData.phone_number,
        visitor_profile: visitorData.visitor_profile,
        visitor_profile_other: visitorData.visitor_profile_other,
        filled_by: visitorData.filled_by,
        checked_out_at: visitorData.checked_out_at ? moment(visitorData.checked_out_at) : null,
      });
      setCurrentProfile(visitorData.visitor_profile);
    }
    
    if (disabled) {
      setFormDisabled(disabled);
    }
  }, [visitorData, form, disabled]);

  return (
    <>
      <Container fluid>
        <Card style={{ background: Palette.BACKGROUND_DARK_GRAY, color: "white" }}
          className="card-stats mb-4 mb-xl-0">
          <CardBody>
            <Row>
              <Col className='mb-3' md={6}>
                <Space align='center'>
                  <Link to={'/visitors'}>
                    <Space align='center'>
                      <Iconify icon={'material-symbols:arrow-back-rounded'} style={{ fontSize: "16px", color: "white" }} />
                    </Space>
                  </Link>
                  <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>Visitors</span>
                </Space>
              </Col>
            </Row>
            <Row>
              <Col className='mb-3' md={12} style={{ marginTop: "40px" }}>
                <Typography.Title level={3} style={{ color: "white" }}>
                  {!visitorData ? "Add New Visitor" : "Update Visitor"}
                </Typography.Title>
              </Col>
            </Row>
            <Row>
              <Col>
                {loading ? (
                  <Flex justify="center" align="center">
                    <Spin />
                  </Flex>
                ) : (
                  <Form
                    layout='vertical'
                    form={form}
                    onFinish={onSubmit}
                    onValuesChange={onValuesChanged}
                    validateTrigger="onSubmit"
                    disabled={formDisabled}
                    autoComplete='off'
                  >
                    <Row gutter={[24, 16]}>
                      <Col md={12}>
                        <Form.Item
                          label={
                            <Typography.Text style={{ color: "white" }}>
                              Visitor Name *
                            </Typography.Text>
                          }
                          name="visitor_name"
                          rules={[
                            { required: true, message: 'Please input visitor name!' },
                            { max: 255, message: 'Maximum 255 characters!' }
                          ]}
                        >
                          <Input 
                            variant='filled' 
                            placeholder="Enter visitor name"
                            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <Typography.Text style={{ color: "white" }}>
                              Phone Number *
                            </Typography.Text>
                          }
                          name="phone_number"
                          rules={[
                            { required: true, message: 'Please input phone number!' },
                            { 
                              pattern: /^[0-9+()-]+$/, 
                              message: 'Invalid phone number format!' 
                            },
                            { max: 20, message: 'Maximum 20 characters!' }
                          ]}
                        >
                          <Input 
                            variant='filled' 
                            placeholder="Enter phone number"
                            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <Typography.Text style={{ color: "white" }}>
                              Visitor Profile *
                            </Typography.Text>
                          }
                          name="visitor_profile"
                          rules={[{ required: true, message: 'Please select visitor profile!' }]}
                        >
                          <Select
                            variant='filled'
                            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                            placeholder="Select profile"
                            onChange={(value) => setCurrentProfile(value)}
                          >
                            {profileOptions.map(option => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {currentProfile === "Other" && (
                          <Form.Item
                            label={
                              <Typography.Text style={{ color: "white" }}>
                                Specify Profile *
                              </Typography.Text>
                            }
                            name="visitor_profile_other"
                            rules={[
                              { required: currentProfile === "Other", message: 'Please specify the profile!' },
                              { max: 255, message: 'Maximum 255 characters!' }
                            ]}
                          >
                            <Input 
                              variant='filled' 
                              placeholder="Enter profile description"
                              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                            />
                          </Form.Item>
                        )}

                        <Form.Item
                          label={
                            <Typography.Text style={{ color: "white" }}>
                              Filled By *
                            </Typography.Text>
                          }
                          name="filled_by"
                          rules={[
                            { required: true, message: 'Please input staff name!' },
                            { max: 255, message: 'Maximum 255 characters!' }
                          ]}
                        >
                          <Input 
                            variant='filled' 
                            placeholder="Enter staff name"
                            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                          />
                        </Form.Item>
                      </Col>

                      <Col md={12}>
                        {visitorData && (
                          <>
                            <Form.Item
                              label={
                                <Typography.Text style={{ color: "white" }}>
                                  Created At
                                </Typography.Text>
                              }
                            >
                              <Input 
                                variant='filled' 
                                value={moment(visitorData.created_at).format('DD MMM YYYY HH:mm:ss')}
                                disabled
                                style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                              />
                            </Form.Item>

                            <Form.Item
                              label={
                                <Typography.Text style={{ color: "white" }}>
                                  Modified At
                                </Typography.Text>
                              }
                            >
                              <Input 
                                variant='filled' 
                                value={moment(visitorData.modified_at).format('DD MMM YYYY HH:mm:ss')}
                                disabled
                                style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                              />
                            </Form.Item>

                            {visitorData.checked_out_at && (
                              <Form.Item
                                label={
                                  <Typography.Text style={{ color: "white" }}>
                                    Checked Out At
                                  </Typography.Text>
                                }
                              >
                                <Input 
                                  variant='filled' 
                                  value={moment(visitorData.checked_out_at).format('DD MMM YYYY HH:mm:ss')}
                                  disabled
                                  style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                                />
                              </Form.Item>
                            )}

                            <Divider style={{ borderColor: "rgba(255,255,255,0.2)" }} />

                            <Flex gap="12px" style={{ marginBottom: 24 }}>
                              {!visitorData.checked_out_at && (
                                <Button 
                                  type="primary" 
                                  danger
                                  onClick={handleCheckout}
                                  icon={<Iconify icon={"material-symbols:logout-rounded"} />}
                                >
                                  Checkout Visitor
                                </Button>
                              )}
                              
                              <Button 
                                type="default" 
                                danger
                                onClick={handleDelete}
                                icon={<Iconify icon={"material-symbols:delete-outline"} />}
                              >
                                Delete Visitor
                              </Button>
                            </Flex>
                          </>
                        )}
                      </Col>
                    </Row>

                    <Divider style={{ borderColor: "rgba(255,255,255,0.2)" }} />

                    {!formDisabled ? (
                      <Flex gap="12px">
                        <Button 
                          size="large" 
                          type='primary' 
                          htmlType='submit' 
                          loading={loadingSubmit}
                          icon={<Iconify icon={visitorData ? "material-symbols:save" : "material-symbols:add"} />}
                        >
                          {!visitorData ? "Add Visitor" : "Save Changes"}
                        </Button>
                        
                        <Button 
                          size="large" 
                          type='default'
                          onClick={() => history.push("/visitors")}
                        >
                          Cancel
                        </Button>
                      </Flex>
                    ) : null}
                  </Form>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
      
      <Prompt
        when={hasChanges && !loadingSubmit}
        message={"Are you sure you want to leave before saving?"}
      />
    </>
  );
}