import React, { useState, useEffect } from 'react';
import { useHistory, Link, Prompt } from 'react-router-dom';
import { 
  Button, 
  message, 
  Spin, 
  Typography, 
  Form, 
  Input, 
  Radio, 
  Space,
  Row,
  Col,
  Card
} from 'antd';
import { Container } from 'reactstrap';
import swal from '../../reusable/CustomSweetAlert';
import FormModel from 'models/VisitorModel';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

// Add custom styles for responsive field spacing
const customStyles = `
  @media (min-width: 768px) and (max-width: 1024px) {
    .visitor-form-item {
      margin-bottom: 14px !important;
    }
  }
`;

export default function VisitorFormPage({
  visitorData,
  disabled,
  isStandalone = false,
  onSubmitSuccess,
}) {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const [formDisabled, setFormDisabled] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentProfile, setCurrentProfile] = useState("Visitor");
  const [formKey, setFormKey] = useState(0);

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
      await form.validateFields();
      
      let body = form.getFieldsValue();
      
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
        msg = 'Successfully added new Visitor';
        result = await FormModel.createVisitor(body);
      } else {
        msg = 'Successfully updated Visitor';
        result = await FormModel.updateVisitor(visitorData.id, body);
      }

      if (result && result.http_code === 200) {
        message.success(msg);
        
        if (isStandalone && onSubmitSuccess) {
          form.resetFields();
          setHasChanges(false);
          setCurrentProfile("Visitor");
          setFormKey(prev => prev + 1);
          
          setTimeout(() => {
            onSubmitSuccess();
          }, 300);
        } else {
          history.push("/visitors");
        }
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
        confirmButtonColor: '#d33'
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
      });
      setCurrentProfile(visitorData.visitor_profile);
      setHasChanges(false);
    } else {
      form.resetFields();
      setCurrentProfile("Visitor");
      setHasChanges(false);
    }
    
    if (disabled) {
      setFormDisabled(disabled);
    }
  }, [visitorData, form, disabled, formKey]);

  return (
    <div style={{ 
      minHeight: 'auto', 
      backgroundColor: '#FFFFFF',
      padding: '8px',
      color: '#000000'
    }}>
      <style>{customStyles}</style>
      <Container fluid style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {!isStandalone && (
          <Row style={{ marginBottom: '12px' }}>
            <Col span={24}>
              <Link to="/visitors" style={{ 
                color: '#000000',
                fontSize: '13px', 
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px',
                fontWeight: 500
              }}>
                <span>←</span> Back
              </Link>
            </Col>
          </Row>
        )}

        {loading ? (
          <Row>
            <Col span={24}>
              <Card style={{ 
                textAlign: 'center', 
                padding: '40px', 
                backgroundColor: '#FFFFFF',
                border: '1px solid #d9d9d9'
              }}>
                <Spin size="large" />
              </Card>
            </Col>
          </Row>
        ) : (
          <Row gutter={[16, 16]}>
            {/* Header Section */}
            <Col span={24}>
              <Card style={{ 
                backgroundColor: '#FFFFFF',
                borderRadius: '6px', 
                border: '1px solid #e0e0e0',
                padding: '12px'
              }} bodyStyle={{ padding: 0 }}>
                <Row align="middle" justify="space-between">
                  <Col span={24}>
                    <Title level={4} style={{ 
                      margin: 0, 
                      fontSize: '20px', 
                      color: '#000000',
                      fontWeight: 700 
                    }}>
                      {!visitorData ? "Visitor Registration" : "Update Visitor"}
                    </Title>
                    {visitorData && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666666' }}>
                        <span style={{ marginRight: '16px' }}>
                          <strong style={{ color: '#000000' }}>Created:</strong> {moment(visitorData.created_at).format('DD MMM YYYY HH:mm')}
                        </span>
                        {visitorData.checked_out_at && (
                          <span style={{ color: '#d93025' }}>
                            <strong>Checked out:</strong> {moment(visitorData.checked_out_at).format('DD MMM YYYY HH:mm')}
                          </span>
                        )}
                      </div>
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Main Form Section */}
            <Col span={24}>
              <Card style={{ 
                backgroundColor: '#FFFFFF',
                borderRadius: '6px', 
                border: '1px solid #e0e0e0',
                padding: '16px'
              }} bodyStyle={{ padding: 0 }}>
                <Form
                  form={form}
                  onFinish={onSubmit}
                  onValuesChange={onValuesChanged}
                  validateTrigger="onSubmit"
                  disabled={formDisabled}
                  autoComplete='off'
                  key={formKey}
                  layout="vertical"
                >
                  <Row gutter={[32, 0]}>
                    {/* Single Column - All fields vertical */}
                    <Col xs={24}>
                      <Form.Item
                        label={
                          <span style={{ 
                            color: '#000000',
                            fontWeight: 600, 
                            fontSize: '14px' 
                          }}>
                            Visitor Name <span style={{ color: '#ff4d4f' }}>*</span>
                          </span>
                        }
                        name="visitor_name"
                        rules={[
                          { required: true, message: 'Required!' },
                          { max: 255, message: 'Max 255 chars!' }
                        ]}
                        style={{ marginBottom: '10px' }}
                        className="visitor-form-item"
                      >
                        <Input 
                          placeholder="Enter name"
                          style={{ 
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #d9d9d9',
                            color: '#000000',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            height: '34px'
                          }}
                          className="responsive-input"
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span style={{ 
                            color: '#000000',
                            fontWeight: 600, 
                            fontSize: '14px' 
                          }}>
                            Phone Number <span style={{ color: '#ff4d4f' }}>*</span>
                          </span>
                        }
                        name="phone_number"
                        rules={[
                          { required: true, message: 'Required!' },
                          { pattern: /^[0-9+()-]+$/, message: 'Invalid format!' },
                          { max: 20, message: 'Max 20 chars!' }
                        ]}
                        style={{ marginBottom: '10px' }}
                        className="visitor-form-item"
                      >
                        <Input 
                          placeholder="Enter phone"
                          style={{ 
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #d9d9d9',
                            color: '#000000',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            height: '34px'
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span style={{ 
                            color: '#000000',
                            fontWeight: 600, 
                            fontSize: '14px' 
                          }}>
                            Staff Name <span style={{ color: '#ff4d4f' }}>*</span>
                          </span>
                        }
                        name="filled_by"
                        rules={[
                          { required: true, message: 'Required!' },
                          { max: 255, message: 'Max 255 chars!' }
                        ]}
                        style={{ marginBottom: '10px' }}
                        className="visitor-form-item"
                      >
                        <Input 
                          placeholder="Enter staff name"
                          style={{ 
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #d9d9d9',
                            color: '#000000',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            height: '34px'
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span style={{ 
                            color: '#000000',
                            fontWeight: 600, 
                            fontSize: '14px' 
                          }}>
                            Visitor Profile <span style={{ color: '#ff4d4f' }}>*</span>
                          </span>
                        }
                        name="visitor_profile"
                        rules={[{ required: true, message: 'Required!' }]}
                        style={{ marginBottom: currentProfile === "Other" ? '6px' : '10px' }}
                      >
                        <Radio.Group 
                          onChange={(e) => setCurrentProfile(e.target.value)}
                          style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                          {profileOptions.map(option => (
                            <Radio 
                              key={option.value} 
                              value={option.value}
                              style={{ 
                                color: '#000000',
                                fontSize: '14px',
                                display: 'block',
                                marginBottom: '4px'
                              }}
                            >
                              {option.label}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </Form.Item>

                      {/* Other Profile Field */}
                      {currentProfile === "Other" && (
                        <Form.Item
                          name="visitor_profile_other"
                          rules={[
                            { required: true, message: 'Please specify!' },
                            { max: 255, message: 'Max 255 chars!' }
                          ]}
                          style={{ 
                            marginBottom: '10px',
                           
                          }}
                        >
                          <Input 
                            placeholder="Specify other profile"
                            style={{ 
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #d9d9d9',
                              color: '#000000',
                              borderRadius: '4px',
                              padding: '8px 12px',
                              fontSize: '14px',
                              height: '34px'
                            }}
                          />
                        </Form.Item>
                      )}
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <Row style={{ 
                    marginTop: '16px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid #e0e0e0' 
                  }}>
                    <Col span={24}>
                      {!formDisabled ? (
                        <Row align="middle" justify="space-between">
                          <Col>
                            {isStandalone && (
                              <Text style={{ 
                                fontSize: '12px', 
                                color: '#999999',
                                fontStyle: 'italic'
                              }}>
                                Form resets after submission
                              </Text>
                            )}
                          </Col>
                          
                          <Col>
                            <Space size={8}>
                              <Button 
                                htmlType='submit' 
                                loading={loadingSubmit}
                                style={{ 
                                  backgroundColor: '#000000',
                                  borderColor: '#000000',
                                  color: '#FFFFFF',
                                  fontWeight: 600,
                                  height: '36px',
                                  padding: '0 24px',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                              >
                                {!visitorData ? "Submit" : "Save"}
                              </Button>
                              
                              {visitorData && !visitorData.checked_out_at && !isStandalone && (
                                <Button 
                                  onClick={handleCheckout}
                                  style={{ 
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#000000',
                                    color: '#000000',
                                    height: '36px',
                                    padding: '0 20px',
                                    borderRadius: '4px',
                                    fontWeight: 500,
                                    fontSize: '14px'
                                  }}
                                >
                                  Checkout
                                </Button>
                              )}
                              
                              {visitorData && !isStandalone && (
                                <Button 
                                  onClick={handleDelete}
                                  style={{ 
                                    backgroundColor: '#d93025',
                                    borderColor: '#d93025',
                                    color: '#FFFFFF',
                                    height: '36px',
                                    padding: '0 20px',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                >
                                  Delete
                                </Button>
                              )}

                              {!isStandalone && (
                                <Button 
                                  onClick={() => history.push("/visitors")}
                                  style={{ 
                                    height: '36px',
                                    padding: '0 20px',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </Space>
                          </Col>
                        </Row>
                      ) : null}
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <Prompt
        when={hasChanges && !loadingSubmit}
        message={"Are you sure you want to leave before saving?"}
      />
    </div>
  );
}