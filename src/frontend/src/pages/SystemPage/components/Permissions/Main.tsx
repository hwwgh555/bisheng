import { Button } from "@/components/bs-ui/button";
import { SearchInput } from "@/components/bs-ui/input";
import AutoPagination from "@/components/bs-ui/pagination/autoPagination";
import { Switch } from "@/components/bs-ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/bs-ui/table";
import { alertContext } from "@/contexts/alertContext";
import {
  getRoleAssistApi,
  getRoleLibsApi,
  getRolePermissionsApi,
  getRoleSkillsApi,
  updateRolePermissionsApi,
} from "@/controllers/API/user";
import { useTable } from "@/util/hook";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SearchPanne = ({ role_id, title, type, children }) => {
  const { page, pageSize, data, total, loading, setPage, search } = useTable(
    { pageSize: 10 },
    (params) => {
      const { page, pageSize, keyword } = params;
      const param = {
        name: keyword,
        role_id,
        page_num: page,
        page_size: pageSize,
      };
      console.log("type", type, role_id);
      return type === "skill"
        ? getRoleSkillsApi(param)
        : type === "assistant"
        ? getRoleAssistApi({ ...param, type: "assistant" })
        : getRoleLibsApi(param);
    }
  );

  return (
    <>
      <div className="relative flex items-center justify-end">
        <SearchInput
          placeholder="搜索"
          onChange={(e) => search(e.target.value)}
        ></SearchInput>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="z-10 flex h-[428px] w-full items-center justify-center bg-[rgba(255,255,255,0.6)] dark:bg-blur-shared">
            <span className="loading loading-infinity loading-lg"></span>
          </div>
        ) : (
          children(data)
        )}
      </div>
      <AutoPagination
        className="m-0 mt-4 w-auto justify-end"
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={setPage}
      ></AutoPagination>
    </>
  );
};

// -1 id表示新增
interface EditRoleProps {
  id: number;
  menuId: number;
  onChange: (change: boolean) => void;
}

export default function EditRole({ id, menuId, onChange }: EditRoleProps) {
  const { setErrorData, setSuccessData } = useContext(alertContext);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    useSkills: [],
    useLibs: [],
    useAssistant: [],
    manageLibs: [],
  });

  useEffect(() => {
    if (id !== -1) {
      // 获取详情，初始化选中数据
      getRolePermissionsApi(id).then((res) => {
        const useSkills = [],
          useLibs = [],
          manageLibs = [],
          useAssistant = [];
        res.data.forEach((item) => {
          switch (item.type) {
            case 1:
              useLibs.push(Number(item.third_id));
              break;
            case 2:
              useSkills.push(item.third_id);
              break;
            case 3:
              manageLibs.push(Number(item.third_id));
              break;
            case 5:
              useAssistant.push(item.third_id);
              break;
          }
        });
        setForm({ useSkills, useLibs, useAssistant, manageLibs });
      });
    }
  }, [id]);

  const switchDataChange = (id, key, checked) => {
    const index = form[key].findIndex((el) => el === id);
    checked && index === -1 && form[key].push(id);
    !checked && index !== -1 && form[key].splice(index, 1);
    setForm({ ...form, [key]: form[key] });
  };

  // 知识库管理权限switch
  const switchLibManage = (id, checked) => {
    switchDataChange(id, "manageLibs", checked);
    if (checked) switchDataChange(id, "useLibs", checked);
  };
  // 知识库使用权限switch
  const switchUseLib = (id, checked) => {
    if (!checked && form.manageLibs.includes(id)) return;
    switchDataChange(id, "useLibs", checked);
  };
  /**
   * 保存权限信息
   * 批量 保存各个种类权限信息（助手、技能、知识库等）
   * @returns
   */
  const handleSave = async () => {
    // 更新角色权限
    const res = await Promise.all([
      updateRolePermissionsApi({
        role_id: roleId,
        access_id: form.useSkills,
        type: 2,
      }),
      updateRolePermissionsApi({
        role_id: roleId,
        access_id: form.useLibs,
        type: 1,
      }),
      updateRolePermissionsApi({
        role_id: roleId,
        access_id: form.manageLibs,
        type: 3,
      }),
      updateRolePermissionsApi({
        role_id: roleId,
        access_id: form.useAssistant,
        type: 5,
      }),
    ]);

    console.log("form :>> ", form, res);
    setSuccessData({ title: t("success") });
    onChange(true);
  };

  const roleId = id === -1 ? 0 : id;
  const isRoleSelected = id !== -1;

  return (
    <div className="mx-auto overflow-y-auto pb-2 scrollbar-hide">
      <Button className="absolute right-0 top-[-48px]" onClick={handleSave}>
        {t("save")}
      </Button>
      {/* 助手 */}
      {isRoleSelected && (
        <div className={menuId === 1 ? "" : "hidden"}>
          <SearchPanne title={"助手授权"} role_id={roleId} type={"assistant"}>
            {(data) => (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>助手名称</TableHead>
                    <TableHead className="w-[100px]">
                      {t("system.creator")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("system.usePermission")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((el) => (
                    <TableRow key={el.id}>
                      <TableCell className="font-medium">{el.name}</TableCell>
                      <TableCell>{el.user_name}</TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={form.useAssistant.includes(el.id)}
                          onCheckedChange={(bln) =>
                            switchDataChange(el.id, "useAssistant", bln)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SearchPanne>
        </div>
      )}
      {/* 技能 */}

      {isRoleSelected && (
        <div className={menuId === 2 ? "" : "hidden"}>
          <SearchPanne
            title={t("system.skillAuthorization")}
            role_id={roleId}
            type={"skill"}
          >
            {(data) => (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("system.skillName")}</TableHead>
                    <TableHead className="w-[100px]">
                      {t("system.creator")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("system.usePermission")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((el) => (
                    <TableRow key={el.id}>
                      <TableCell className="font-medium">{el.name}</TableCell>
                      <TableCell>{el.user_name}</TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={form.useSkills.includes(el.id)}
                          onCheckedChange={(bln) =>
                            switchDataChange(el.id, "useSkills", bln)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SearchPanne>
        </div>
      )}
      {/* 知识库 */}

      {isRoleSelected && (
        <div className={menuId === 3 ? "" : "hidden"}>
          <SearchPanne
            title={t("system.knowledgeAuthorization")}
            role_id={roleId}
            type={"lib"}
          >
            {(data) => (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("system.skillName")}</TableHead>
                    <TableHead className="w-[100px]">
                      {t("system.creator")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("system.usePermission")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("system.managePermission")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((el) => (
                    <TableRow key={el.id}>
                      <TableCell className="font-medium">{el.name}</TableCell>
                      <TableCell>{el.user_name}</TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={form.useLibs.includes(el.id)}
                          onCheckedChange={(bln) => switchUseLib(el.id, bln)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={form.manageLibs.includes(el.id)}
                          onCheckedChange={(bln) => switchLibManage(el.id, bln)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SearchPanne>
        </div>
      )}
    </div>
  );
}
