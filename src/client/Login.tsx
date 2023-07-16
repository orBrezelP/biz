import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Alert, Spin } from 'antd';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth', { username, password });
      const token = response.data.token;

      // Save the token in local storage or use it as needed
      localStorage.setItem('token', token);
      window.location.reload();

            
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during login.');
      }
    } finally {
      setIsLoading(false);

    }
  };

  return (
    <Spin spinning={isLoading}>
      <Form onFinish={handleLogin}>
        <h2>Login</h2>
        {error && <Alert message={error} type="error" showIcon />}
        <Form.Item
          label="Username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default Login;
