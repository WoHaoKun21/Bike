/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Form, Input, message, Modal, Select, Table, Transfer, Tree } from "antd";
import { forwardRef, useEffect, useRef, useState } from "react";
import Utils from "../../utils";
import Axios from "../../axios";
import menuConfig from "../../config/menuConfig";

const FormItem = Form.Item;
const Option = Select.Option;
const params = { page: 1 };
const Permission = () => {
    const form = useRef();
    const perEdit = useRef();
    const userForm = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState(false);
    const [flag, setFlag] = useState(false);
    const [rowKey, setRowKeys] = useState([]);
    const [rowItem, setRowItem] = useState({});
    const [showCreate, setShowCreate] = useState(false);
    // 设置权限：模态框
    const [showPerm, setShowPerm] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);// 节点树选中的key，默认为数组形式
    // 用户授权：模态框
    const [userShow, setUserShow] = useState(false);
    // 用户授权：模态框
    const [mockData, setMockData] = useState([]);// 用来存储左侧栏数据，右侧数据会自动调整离开
    const [targetKeys, setTargetKeys] = useState([]);// 用来存储右侧栏数据
    useEffect(() => {
        Axios.ajax({
            url: "/role/list",
            data: { params }
        }).then(res => {
            if (res.code === 0) {
                res.result.item_list.map((item, index) => item.key = index);
                setDataSource(res.result.item_list);
                setPagination(Utils.pagination(res, (current) => {// 用来实现分页效果
                    params.page = current;
                    setFlag(!flag);
                }));
            }
        })
    }, [flag]);
    // 点击行事件
    const onhandleClick = (record, index) => {
        let key = [index];
        setRowKeys(key);
        setRowItem(record);
    }
    const onOk = () => {
        let list = form.current.getFieldsValue();
        Axios.ajax({
            url: "/role/create",
            data: { params: list }
        }).then(res => {
            if (res.code === 0) {
                message.success("用户创建成功");
                setShowCreate(false);
                setFlag(!flag)
            }
        })
    }
    // “权限设置”点击事件
    const onhandlePrem = () => {
        if (!rowItem.id) {
            Modal.info({
                title: "提示",
                content: "请选择一位用户"
            });
            return;
        }
        setShowPerm(true);
        setCheckedKeys(rowItem.menuType);
    }
    // "权限设置"模态框ok按钮
    const onhandlePerEdit = () => {
        let data = perEdit.current.getFieldsValue();
        data.id = rowItem.id;
        data.menus = checkedKeys;
        Axios.ajax({
            url: "/permission/edit",
            data: { params: data }
        }).then(res => {
            if (res.code === 0) {
                message.success("权限修改成功");
                setShowPerm(false);
                setRowItem({});
                setRowKeys([])
                setFlag(!flag);
            }
        })
    }

    // "用户授权"按钮，点击事件
    const handleUserSubmit = () => {
        if (!rowItem.id) {
            Modal.info({
                title: "提示",
                content: "请选择一位用户"
            });
            return;
        }
        Axios.ajax({
            url: "/role/user_list",
            data: { params: { id: rowItem.id } }
        }).then(res => {
            if (res.code === 0) {
                setUserShow(true);
                getRoleUserList(res.result);
            }
        })
    }
    // 用来筛选获取到的用户！
    const getRoleUserList = (dataSource) => {// 根据转态来确定用户是在左还是在右
        const mockData = [];
        const targetKeys = [];
        if (dataSource && dataSource.length > 0) {
            dataSource.map(item => {// 下标使用来
                const data = {
                    key: item.user_id,
                    title: item.user_name,
                    status: item.status
                }
                if (item.status === 1) {
                    targetKeys.push(data.key);
                }
                mockData.push(data);
                return "";
            });
        }
        setMockData(mockData);
        setTargetKeys(targetKeys);
    }
    // “用户权限”按钮模态框的OK事件
    const onhandleUserSubmit = () => {
        let data = userForm.current.getFieldsValue();
        data.role_id = rowItem.id;// 选中角色的id
        data.user_ids = targetKeys;// 拥有这个角色的所有用户id
        Axios.ajax({
            url: "/role/user_role_edit",
            data: { params: data },
        }).then(res => {
            if (res.code === 0) {
                message.success("用户权限设置成功");
                setRowItem({});
                setRowKeys([]);
                setUserShow(false);
            }
        })
    }



    const columns = [
        { title: "角色ID", dataIndex: "id", align: "center" },
        { title: "角色名称", dataIndex: "role_name", align: "center" },
        { title: "使用状态", dataIndex: "status", align: "center", render(text) { return text === 1 ? "启用" : "停用" } },
        { title: "授权人", dataIndex: "authorize_user_name", align: "center" },
        {
            title: "授权时间", dataIndex: "authorize_time", align: "center",
            render(text) { return Utils.formateDate(text) }
        },
        {
            title: "创建时间", dataIndex: "create_time", align: "center",
            render(text) { return Utils.formateDate(text) }
        }
    ]
    const rowSelection = { type: "radio", selectedRowKeys: rowKey }
    const formItemList = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 }
    }
    return (
        <div style={{ width: "100%" }}>
            <Card title="权限设置" className="operate-wrap">
                <Button type="primary" onClick={() => setShowCreate(true)}>创建角色</Button>
                <Button type="primary" onClick={onhandlePrem}>权限设置</Button>
                <Button type="primary" onClick={handleUserSubmit}>用户授权</Button>
            </Card>
            <div className="content-wrap">
                <Table
                    bordered
                    pagination={pagination}
                    columns={columns}
                    dataSource={dataSource}
                    rowSelection={rowSelection}
                    onRow={(record, index) => ({
                        onClick: () => { onhandleClick(record, index) }
                    })}
                />
            </div>
            <Modal
                title="创建角色"
                visible={showCreate}
                onCancel={() => setShowCreate(false)}
                onOk={onOk}
            >
                <Form ref={form}>
                    <FormItem label="用户名" name="username" {...formItemList}>
                        <Input placeholder="请输入用户名" />
                    </FormItem>
                    <FormItem label="状态" name="status" {...formItemList}>
                        <Select>
                            <Option value={0}>开启</Option>
                            <Option value={1}>关闭</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
            <Modal
                title="设置权限"
                visible={showPerm}
                onCancel={() => setShowPerm(false)}
                onOk={onhandlePerEdit}
            >
                <PermEditForm
                    ref={perEdit}
                    userInfo={rowItem}
                    checkedKeys={checkedKeys}
                    patchMenuInfo={(checkedKeys) => setCheckedKeys(checkedKeys)}
                />
            </Modal>
            <Modal
                title="用户授权"
                visible={userShow}
                onCancel={() => setUserShow(false)}
                onOk={onhandleUserSubmit}
            >
                <RoleAuthForm
                    ref={userForm}
                    userInfo={rowItem}
                    mockData={mockData}
                    targetKeys={targetKeys}
                    changeUserInfo={(targetKeys) => setTargetKeys(targetKeys)}
                />
            </Modal>
        </div>
    );
}

export default Permission;
// 权限编辑列表
const PermEditForm = forwardRef((props, ref) => {
    const { userInfo, checkedKeys } = props;
    const onCheck = (checkedKeys) => {
        props.patchMenuInfo(checkedKeys)
    }
    const formItemList = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 }
    }
    return (
        <Form ref={ref}>
            <FormItem label="角色名称" name='username' initialValue={userInfo.role_name}  {...formItemList}>
                <Input disabled />
            </FormItem>
            <FormItem label="状态" name='status' initialValue={userInfo.status} {...formItemList}>
                <Select>
                    <Option value={0}>开启</Option>
                    <Option value={1}>关闭</Option>
                </Select>
            </FormItem>
            <Tree
                checkable
                treeData={menuConfig}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
            />
        </Form>
    )
});
// 用户授权表单
const RoleAuthForm = forwardRef((props, ref) => {
    const { userInfo, mockData, targetKeys } = props;
    // 实现搜索框搜索功能
    const filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    }
    // 实现用户左右调转
    const handleChange = (targetKeys) => props.changeUserInfo(targetKeys);
    const formItemList = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 }
    }
    return (
        <Form ref={ref}>
            <FormItem label="角色名称" name="role_id" initialValue={userInfo.role_name} {...formItemList} >
                <Input disabled />
            </FormItem>
            <FormItem label="选择用户" {...formItemList}>
                <Transfer
                    showSearch
                    dataSource={mockData}
                    targetKeys={targetKeys}
                    titles={["待选用户", "已选用户"]}
                    render={(record) => record.title}
                    filterOption={filterOption}
                    onChange={handleChange}
                    listStyle={{ width: 300, height: 350 }}
                />
            </FormItem>
        </Form>
    )
})