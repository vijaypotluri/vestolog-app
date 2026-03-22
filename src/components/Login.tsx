import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService, LoginRequest } from '../services/authService';

const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: LoginRequest & { remember: boolean }) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', values.email);
      const result = await authService.login({
        email: values.email,
        password: values.password
      });
      
      console.log('Login result:', result);
      
      if (result.error) {
        console.log('Login error:', result.error);
        message.error(result.error);
      } else {
        console.log('Login successful, token:', result.token);
        message.success(result.message || 'Login successful!');
        if (result.token) {
          authService.storeToken(result.token);
          console.log('Token stored, checking auth:', authService.isAuthenticated());
        }
        console.log('Navigating to home...');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Sign In</Title>
          <Text type="secondary">Welcome back! Please login to your account</Text>
        </div>
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          scrollToFirstError
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              },
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              Sign In
            </Button>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Text type="secondary">Don't have an account?</Text>
              <Button 
                type="link" 
                onClick={() => navigate('/register')}
                style={{ padding: 0 }}
              >
                Sign Up
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
