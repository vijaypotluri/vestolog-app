import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Modal, Form, Input, InputNumber, Select } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface OptionData {
  key: string;
  ticker: string;
  expiryDate: string;
  userId: string;
  quantity: number;
  price: number;
  status: 'OPEN' | 'CLOSED';
}

const generateOptionsData = (): OptionData[] => {
  const tickers = ['AAPL', 'AMZN', 'MSFT', 'GOOGL', 'TSLA', 'META', 'NVDA', 'NFLX'];
  const statuses = ['OPEN', 'CLOSED'] as const;

  return tickers.map((ticker, i) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 90));
    const quantity = Math.floor(Math.random() * 1000) + 100;
    const price = parseFloat((Math.random() * 500 + 50).toFixed(2));

    return {
      key: i.toString(),
      ticker,
      expiryDate: expiryDate.toISOString().split('T')[0],
      userId: `user-${i + 1}`,
      quantity,
      price,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
};

const columns: ColumnsType<OptionData> = [
  {
    title: 'Ticker',
    dataIndex: 'ticker',
    key: 'ticker',
    sorter: (a, b) => a.ticker.localeCompare(b.ticker),
  },
  {
    title: 'Expiry Date',
    dataIndex: 'expiryDate',
    key: 'expiryDate',
    render: (date: string) => new Date(date).toLocaleDateString(),
    sorter: (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
  },
  {
    title: 'User ID',
    dataIndex: 'userId',
    key: 'userId',
    sorter: (a, b) => a.userId.localeCompare(b.userId),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (quantity: number) => quantity.toLocaleString(),
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => `$${price.toFixed(2)}`,
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: 'OPEN' | 'CLOSED') => (
        <Tag color={status === 'OPEN' ? 'green' : 'red'}>
          {status}
        </Tag>
    ),
    sorter: (a, b) => a.status.localeCompare(b.status),
  },
];

export const OptionsTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [addTradeModalVisible, setAddTradeModalVisible] = useState(false);
  const [addTradeLoading, setAddTradeLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axios.get('/api/users');
      const users = response.data;
      alert(`Users API Response:\n${JSON.stringify(users, null, 2)}`);
      message.success('Successfully fetched users!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error fetching users:\n${errorMessage}`);
      message.error('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const addTrade = async (values: any) => {
    setAddTradeLoading(true);
    try {
      const tradeData = {
        ticker: values.ticker,
        expiryDate: values.expiryDate,
        userId: values.userId,
        quantity: values.quantity,
        price: values.price,
        status: values.status
      };

      const response = await axios.post('/api/trades', tradeData);
      alert(`Trade Added Successfully:\n${JSON.stringify(response.data, null, 2)}`);
      message.success('Trade added successfully!');
      setAddTradeModalVisible(false);
      form.resetFields();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error adding trade:\n${errorMessage}`);
      message.error('Failed to add trade');
    } finally {
      setAddTradeLoading(false);
    }
  };

  useEffect(() => {
    const data = generateOptionsData();
    setDataSource(data);
    setLoading(false);
  }, []);

  return (
      <div style={{
        padding: '24px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Options Portfolio</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setAddTradeModalVisible(true)}
            >
              Add Trade
            </Button>
            <Button 
              type="default" 
              icon={<UserOutlined />}
              loading={usersLoading}
              onClick={fetchUsers}
            >
              Fetch Users
            </Button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Table
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '25', '50', '100']
              }}
              bordered
              size="middle"
              scroll={{ y: 'calc(100vh - 180px)' }}
              style={{ height: '100%' }}
          />
        </div>
        
        <Modal
          title="Add New Trade"
          open={addTradeModalVisible}
          onCancel={() => {
            setAddTradeModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={addTrade}
          >
            <Form.Item
              name="ticker"
              label="Ticker"
              rules={[{ required: true, message: 'Please enter ticker symbol' }]}
            >
              <Input placeholder="e.g., AAPL" style={{ textTransform: 'uppercase' }} />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="Expiry Date"
              rules={[{ required: true, message: 'Please select expiry date' }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="userId"
              label="User ID"
              rules={[{ required: true, message: 'Please enter user ID' }]}
            >
              <Input placeholder="e.g., test-user" />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Please enter quantity' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="100"
                min={1}
                precision={0}
              />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                min={0}
                precision={2}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: string | undefined) => {
                  const parsed = parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0');
                  return isNaN(parsed) ? 0 : parsed;
                }}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Select.Option value="OPEN">OPEN</Select.Option>
                <Select.Option value="CLOSED">CLOSED</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Button
                style={{ marginRight: 8 }}
                onClick={() => {
                  setAddTradeModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={addTradeLoading}>
                Add Trade
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};