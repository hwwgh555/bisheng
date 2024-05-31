import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/bs-ui/select";
import type { User } from "@/types/api/user";
import { Role } from "@/types/api/user";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { userContext } from "../../../../contexts/userContext";
import { getRolesApi, getUsersApi } from "../../../../controllers/API/user";
import { useTable } from "../../../../util/hook";
import Main from "./Main";
import type { Menu } from "./MenuItem";
import MenuItem from "./MenuItem";

export default function Index(params) {
  const { user } = useContext(userContext);
  const { t } = useTranslation();

  const {
    page,
    pageSize,
    data: users,
    total,
    loading,
    setPage,
    search,
    reload,
  } = useTable<User>({ pageSize: 13 }, (param) =>
    getUsersApi(param.keyword, param.page, param.pageSize)
  );

  const [menus, setMenus] = useState<Menu[]>([
    { id: 1, title: "助手权限", active: true },
    { id: 2, title: "技能权限", active: false },
    { id: 3, title: "知识库权限", active: false },
  ]);

  const chooseMenu = (id: number) => {
    setMenus(menus.map((item) => ({ ...item, active: item.id === id })));
  };

  const handleChange = (change: boolean) => {
    // change && loadData()
    // setRole(null)
  };

  const [roles, setRoles] = useState<Role[]>([]);
  const [curRole, setCurRole] = useState<Role>({
    id: -1,
    role_name: "",
    remark: "",
    create_time: "",
    update_time: "",
  });

  const getRoles = async () => {
    const list = await getRolesApi();
    setRoles(list);
  };

  const handleSelect = async (id: number) => {
    setCurRole(roles.find((item) => item.id === id));
    setMenus(menus.map((item, index) => ({ ...item, active: index === 0 })));
  };

  useEffect(() => {
    getRoles();
  }, []);

  const curMenu = menus.find((item) => item.active) || ({} as Menu);

  return (
    <div className="relative">
      <div className="flex h-[calc(100vh-136px)] overflow-y-auto pb-10">
        <div className="flex flex-col pr-3">
          <div className="w-[148px] pb-2.5">
            <Select onValueChange={handleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="角色名称" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.role_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {menus.map((item, index) => (
            <MenuItem
              key={item.id}
              title={item.title}
              active={item.active}
              onClick={() => chooseMenu(item.id)}
            />
          ))}
        </div>
        <div className="flex-1">
          <Main id={curRole.id} menuId={curMenu.id} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}
