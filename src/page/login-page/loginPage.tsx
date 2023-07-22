import React, { useContext } from "react";
import { Button, Divider, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  GoogleOutlined,
  FacebookFilled,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import "./loginPage.scss";
import RouterLinks from "../../const/router_link";
import useAction from "../../redux/useActions";
import { useDispatch } from "react-redux";
import { authServices } from "../../utils/services/authService";
import { notification } from "../../components/notification";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import { serverConfig } from "../../const";
const LoginPage: React.FC = () => {
  const { socket } = useContext(AppContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const actions = useAction();
  const dispatch = useDispatch();
  const handleValueChange = () => {
    // console.log(form.getFieldsValue());
  };

  const handleLogin = async () => {
    try {
      const message = await authServices.handleLogin(form.getFieldsValue());
      if (message.status) {
        socket.io.opts.query = { username: message?.data?.username };
        socket.disconnect();
        socket.connect();
        localStorage.setItem("username", message?.data?.username);
        dispatch(actions.AuthActions.setuserInfo(message.data));
        dispatch(actions.StateAction.loginState(true));
        // dispatch(actions.StateAction.initSocket(io(serverConfig.server)));
        navigate(RouterLinks.HOME_PAGE);
      } else {
        console.log("false");
        notification({
          message: message.message,
          title: "Thông báo",
          position: "top-right",
          type: "danger",
        });
      }
    } catch (err: any) {
      notification({
        message: err.message,
        title: "Thông báo",
        position: "top",
        type: "danger",
      });
    }
  };
  const handleLoginWithGGFB = (type: any) => {
    window.open(`${serverConfig.server}/api/auth/${type}`, "_self");
  };

  return (
    <div className="login-page">
      <Form onValuesChange={handleValueChange} form={form} className="login">
        <Typography.Title>Chat app</Typography.Title>
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
        <Button onClick={handleLogin} type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
        <span>Bạn chưa có tài khoản.</span>
        <Link to={RouterLinks.REGISTER_PAGE}>Đăng ký?</Link>
        <Divider style={{ borderBlock: "black" }}>Or login with </Divider>
        <div className="socialLogin">
          <GoogleOutlined
            onClick={() => handleLoginWithGGFB("google")}
            style={{ color: "red", cursor: "pointer" }}
          />
          <FacebookFilled
            onClick={() => handleLoginWithGGFB("facebook")}
            style={{ color: "#1876F2", cursor: "pointer" }}
          />
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
