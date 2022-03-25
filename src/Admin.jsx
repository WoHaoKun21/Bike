import { Col, Row } from "antd";
import NavLeft from "./components/NavLeft";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./style/common.less";

const Admin = (props) => {
    return (
        <Row className="container">
            <Col span={4} className="nav-left">
                <NavLeft />
            </Col>
            <Col span={20} className="main">
                <Header />
                <Row className="content">
                    <div className="home-wrap" style={{ width: "100%" }}>
                        {props.children}
                    </div>
                </Row>
                <Footer />
            </Col>
        </Row>
    );
}

export default Admin;