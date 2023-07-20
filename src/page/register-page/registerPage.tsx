import React from "react";
import { Form, Typography, Input, Divider, Button } from "antd";
import useAction from "../../redux/useActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notification } from "../../components/notification";
import RouterLinks from "../../const/router_link";
import { authServices } from "../../utils/services/authService";
import {
  GoogleOutlined,
  FacebookFilled,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import "./registerPage.scss";
const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const actions = useAction();
  const dispatch = useDispatch();
  const handleRegister = async () => {
    try {
      const data = await authServices.handleRegister(form.getFieldsValue());
      if (data.status) {
        localStorage.setItem("username", data?.data?.username);
        dispatch(actions.AuthActions.setuserInfo(data.data));
        dispatch(actions.StateAction.loginState(true));
        navigate(RouterLinks.HOME_PAGE);
      } else {
        notification({
          message: data.message,
          title: "Thông báo",
          position: "top-right",
          type: "danger",
        });
      }
    } catch (err: any) {
      notification({
        message: err.message,
        title: "Thông báo",
        position: "top-right",
        type: "danger",
      });
    }
  };
  return (
    <div className="register-page">
      <Form form={form} className="register">
        <Typography.Title>Chat app</Typography.Title>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên hiện thị!",
            },
          ]}
          name="displayName"
        >
          <Input placeholder="Tên hiển thị" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đăng nhập!",
            },
          ]}
          label=""
          name="username"
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              type: "email",
              message: "Đây không phải là email!",
            },
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
          ]}
          name="email"
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}
          name="password"
        >
          <Input.Password
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            placeholder="Mật khẩu"
          />
        </Form.Item>

        <Button onClick={handleRegister} type="primary" htmlType="submit" block>
          Đăng ký
        </Button>
        <Divider style={{ borderBlock: "black" }}>Or login with </Divider>
        <div className="socialLogin">
          <GoogleOutlined style={{ color: "red", cursor: "pointer" }} />
          <FacebookFilled style={{ color: "#1876F2", cursor: "pointer" }} />
        </div>
      </Form>
    </div>
  );
};
export default RegisterPage;
