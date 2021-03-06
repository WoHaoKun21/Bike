/* eslint-disable jsx-a11y/anchor-is-valid */
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Utils from "../../utils";
import "./index.less";

const Header = (props) => {
    const { menuType, menuName } = props;
    const [time, setTime] = useState("");
    useEffect(() => {
        setInterval(() => {
            let data = new Date().getTime()
            setTime(Utils.formateDate(data));
        }, 2000);
    }, [time]);
    return (
        <div className='header'>
            <Row className="header-top">
                {
                    menuType ? <Col span={6} className="logo">
                        <img src="/assets/logo-ant.svg" alt="" />
                        <span>Bike 通用管理系统</span>
                    </Col> : null
                }
                <Col span={menuType ? 18 : 24}>
                    <span>欢迎，秦皇岛 海港区</span>
                    <a href="#" className={menuType ? menuType : ""}>退出</a>
                </Col>
            </Row>
            {
                menuType ? null :
                    <Row className='breadcrumb'>
                        <Col span={4} className="bread-title">
                            {menuName}
                        </Col>
                        <Col span={20} className="weather">
                            <span className='date'>{time}</span>
                            <span className='weather-detail'>
                                <i className={`qi-100`}></i>
                                晴
                            </span>
                        </Col>
                    </Row>
            }
        </div>
    );
};
const mapState = (state) => ({
    menuName: state.menuName
})
export default connect(mapState)(Header);
