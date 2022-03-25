import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import MenuConfig from "../../config/menuConfig";
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
        return <MenuItem key={item.title} title={item.title}>
            <NavLink to={item.key}>{item.title}</NavLink>
        </MenuItem>
    })
}

const NavLeft = (props) => {
    return (
        <div>
            <div className='logo'>
                <img src="./assets/logo-ant.svg" alt="" />
                <h1>My Bike</h1>
            </div>
            <Menu
                theme="dark"
            >
                {renderMenu(MenuConfig)}
            </Menu>
        </div>
    );
};

export default NavLeft;
