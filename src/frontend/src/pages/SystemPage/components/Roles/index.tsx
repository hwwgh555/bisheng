import { PlusIcon } from "@/components/bs-icons/plus";
import { bsConfirm } from "@/components/bs-ui/alertDialog/useConfirm";
import { Role } from "@/types/api/user";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/bs-ui/button";
import { SearchInput } from "../../../../components/bs-ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/bs-ui/table";
import { delRoleApi, getRolesApi } from "../../../../controllers/API/user";
import { captureAndAlertRequestErrorHoc } from "../../../../controllers/request";
import Modal from "./Modal";

export const DEFAULT_MODAL_ROLE = {
  id: -1, // 不存在
  name: "",
  remark: "",
};

export default function Roles() {
  const { t } = useTranslation();

  const [role, setRole] = useState<Partial<Role>>(DEFAULT_MODAL_ROLE);
  const [visible, setVisible] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const allRolesRef = useRef([]);

  const handleEdit = (role: Role) => {
    setRole(role);
    showModal();
  };

  const handleCreate = () => {
    setRole(DEFAULT_MODAL_ROLE);
    showModal();
  };

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setRole(DEFAULT_MODAL_ROLE);
  };

  const handleChange = () => {
    hideModal();
    loadData();
  };

  const loadData = () => {
    getRolesApi().then((data) => {
      setRoles(data);
      allRolesRef.current = data;
    });
  };

  useEffect(() => loadData(), []);

  // 删除
  const handleDelete = (item) => {
    bsConfirm({
      desc: `${t("system.confirmText")} 【${item.role_name}】 ?`,
      okTxt: t("delete"),
      onOk(next) {
        captureAndAlertRequestErrorHoc(delRoleApi(item.id).then(loadData));
        next();
      },
    });
  };

  // 验证重名
  const checkSameName = (name: string) => {
    return roles.find(
      (_role) => _role.role_name === name && role.id !== _role.id
    );
  };

  // search
  const [searchWord, setSearchWord] = useState("");
  const handleSearch = (e) => {
    const word = e.target.value;
    setSearchWord(word);
    setRoles(
      allRolesRef.current.filter((item) =>
        item.role_name.toUpperCase().includes(word.toUpperCase())
      )
    );
  };

  return (
    <div className="relative">
      <div className="h-[calc(100vh-136px)] overflow-y-auto pb-10">
        <div className="flex items-center justify-end gap-6">
          <div className="relative w-[180px]">
            <SearchInput
              placeholder={t("system.roleName")}
              onChange={handleSearch}
            ></SearchInput>
          </div>
          <Button className="flex justify-around" onClick={handleCreate}>
            <PlusIcon className="text-primary" />
            <span className="mx-4 text-[#fff]">{t("create")}</span>
          </Button>
        </div>
        <Table className="mb-10">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                {t("system.roleName")}
              </TableHead>
              <TableHead>备注</TableHead>
              <TableHead>{t("createTime")}</TableHead>
              <TableHead className="text-right">{t("operations")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((el) => (
              <TableRow key={el.id}>
                <TableCell className="font-medium">{el.role_name}</TableCell>
                <TableCell>{el.remark}</TableCell>
                <TableCell>{el.create_time.replace("T", " ")}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="link"
                    onClick={() => handleEdit(el)}
                    className="px-0 pl-6"
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    variant="link"
                    disabled={[1, 2].includes(el.id)}
                    onClick={() => handleDelete(el)}
                    className="px-0 pl-6 text-red-500"
                  >
                    {t("delete")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="bisheng-table-footer">
        <p className="desc">{t("system.roleList")}</p>
      </div>
      <Modal
        visible={visible}
        info={role}
        hideModal={hideModal}
        onConfirm={handleChange}
      ></Modal>
    </div>
  );
}
