/* eslint-disable no-mixed-operators */
import { Modal } from "antd";
import axios from "axios";
import Utils from "../utils"
class Axios {
    static requestList(url, params, type, isMock) {
        const { setDataSource, setPagination, setFlag, flag } = type;
        let data = { params, isMock };
        this.ajax({
            url,
            data
        }).then(data => {
            if (data.code === 0) {
                let list = data.result.item_list;
                list.map((i, d) => i.key = d);
                setDataSource(list);
                setPagination(Utils.pagination(data, (current) => {
                    params.page = current;
                    setFlag(!flag);
                }));
            }
        });
    }
    static ajax(options) {
        let loading;
        if (options.data && options.data.isShowLoading !== false) {
            loading = document.getElementById("ajaxLoading");
            loading.style.display = "block";
        };
        let baseUrl;
        if (options.data.isMock) {
            baseUrl = "https://www.fastmock.site/mock/848eebc6348a60f19ecc6f2e1cdf8431/Mockapi";
        } else {
            baseUrl = "https://www.fastmock.site/mock/848eebc6348a60f19ecc6f2e1cdf8431/Mockapi"
        }
        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: "get",
                baseURL: baseUrl,
                timeout: 5000,// 5秒后请求不返回就是超时了
                params: (options.data && options.data.params) || ""
            }).then(res => {
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById("ajaxLoading");
                    loading.style.display = "none";
                };
                if (res.status === 200) {// 这是成功后执行的命令
                    if (res.data.code === 0) {
                        resolve(res.data);
                    } else {
                        Modal.info({
                            title: "提示",
                            content: res.data.msg
                        });
                    }
                } else {// 状态码错误后执行的代码
                    reject(res.data);
                }
            })
        })
    }
}

export default Axios;