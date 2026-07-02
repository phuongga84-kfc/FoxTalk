import "../styles/theme.css"
import "../styles/signUpPage.css";
import React from 'react'
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Typography,
} from "antd";

import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    GoogleOutlined,
} from "@ant-design/icons";

import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
const { Title, Text } = Typography;

const SignUpPage = () => {
    const [form] = Form.useForm();
    const { signUp } = useAuthStore()
    const navigate = useNavigate()
    const onFinish = async (data) => {
        const { firstname, lastname, username, email, password } = data

        const success = await signUp(firstname, lastname, username, email, password)

        if (success) {
            navigate("/signin")
        }
    };
    return (
        <div className="signup">

            {/* LEFT */}
            <div className="signup-left">
                <div className="overlay">
                    <Title level={1} style={{ color: "#fff", marginBottom: 10 }}>
                        FoxTalk
                    </Title>

                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 18,
                            textAlign: "center",
                            maxWidth: 500,
                        }}
                    >
                        Kết nối bạn bè, gia đình và mọi người trên toàn thế giới.
                    </Text>
                </div>
            </div>

            {/* RIGHT */}
            <div className="signup-right">

                <div className="signup-card">

                    <div className="auth-header">
                        <img
                            className="auth-logo"
                            src="/logo.png"
                            alt="FoxTalk logo"
                        />
                        <Title level={2}>Tạo tài khoản</Title>
                        <Text type="secondary">
                            Tạo tài khoản để bắt đầu sử dụng FoxTalk
                        </Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        style={{ marginTop: 30 }}
                    >

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Họ"
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập họ!",
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="Nhập họ"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Tên"
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tên!",
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="Nhập tên"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Tên đăng nhập"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên đăng nhập!",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<UserOutlined />}
                                placeholder="Nhập tên đăng nhập"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email!",
                                },
                                {
                                    type: "email",
                                    message: "Email không hợp lệ!",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<MailOutlined />}
                                placeholder="Nhập email"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu!",
                                },
                                {
                                    min: 6,
                                    message: "Mật khẩu phải có ít nhất 6 ký tự!",
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập lại mật khẩu!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(
                                            new Error("Mật khẩu xác nhận không khớp!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined />}
                                placeholder="Nhập lại mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginTop: 10 }}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                size="large"
                                block
                                className="signup-btn"
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>

                    </Form>

                    <Divider>Hoặc</Divider>

                    <Button
                        icon={<GoogleOutlined />}
                        size="large"
                        block
                        className="google-btn"
                    >
                        Đăng ký bằng Google
                    </Button>

                    <div className="signin-link">
                        Đã có tài khoản?{" "}
                        <Link to="/signin">
                            Đăng nhập ngay
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default SignUpPage