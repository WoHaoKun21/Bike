import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import MenuConfig from "../../config/menuConfig";
import * as actions from "../../redux/actions";

import "./index.less";

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

// 创建左侧导航栏
const renderMenu = (data) => {
    return data.map(item => {
        if (item.children) {
            return <SubMenu key={item.key} title={item.title}>
                {renderMenu(item.children)}
            </SubMenu>
        }
        return <MenuItem key={item.key} title={item.title}>
            <NavLink to={item.key}>{item.title}</NavLink>
        </MenuItem>
    })
}

const NavLeft = (props) => {
    const [selectKeys, setSelectKeys] = useState([]);// 选中Menu.Item

    useEffect(() => {
        let currentKey = window.location.hash.replace(/#|\?.*$/g, "");
        setSelectKeys(currentKey);
    }, [selectKeys]);

    const handleClick = ({ item, key }) => {
        props.changeName(item.props.title);
        setSelectKeys(key);
    };
    return (
        <div>
            <div className='logo'>
                <img src="./assets/logo-ant.svg" alt="" />
                <h1>My Bike</h1>
            </div>
            <Menu
                theme="dark"
                onClick={handleClick}
                selectedKeys={selectKeys}
            >
                {renderMenu(MenuConfig)}
            </Menu>
        </div>
    );
};
export default connect(null, actions)(NavLeft);
