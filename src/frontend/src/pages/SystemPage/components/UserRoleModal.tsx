import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/bs-ui/dialog";
import MultiSelect from "@/components/bs-ui/select/multi";
import { alertContext } from "@/contexts/alertContext";
import { UserRole } from "@/types/api/user";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/bs-ui/button";
import {
  getRolesApi,
  getUserRoles,
  updateUserRoles,
} from "../../../controllers/API/user";
import { captureAndAlertRequestErrorHoc } from "../../../controllers/request";

export default function UserRoleModal({ id, onClose, onChange }) {
  const { t } = useTranslation();

  const { setErrorData, setSuccessData } = useContext(alertContext);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(false);

  // 普通用户 role_id=2
  const DEFAULT_USER_MARK = 2;
  useEffect(() => {
    if (!id) return;
    getRolesApi().then((data) => {
      // const roleOptions = data.filter(role => role.id !== 1)
      const roleOptions = data
        .filter((role) => role.id !== DEFAULT_USER_MARK)
        .map((role) => ({ ...role, role_id: role.id }));
      setRoles(roleOptions);

      getUserRoles(id).then((userRoles) => {
        // // 默认设置 普通用户
        // if (!userRoles.find(role => role.role_id === 2)) {
        //     const roleByroles = roleOptions.find(role => role.role_id === 2)
        //     userRoles.unshift({ ...roleByroles })
        // }
        const selected = userRoles.filter(
          (role) => role.role_id !== DEFAULT_USER_MARK
        );
        setSelected(selected);
      });
      // console.log(roles)
    });
    setError(false);
  }, [id]);

  function compareDepartments(a, b) {
    return a.role_id === b.role_id;
  }

  const handleCancel = () => {
    setSelected([]);
    onClose();
  };

  const handleSave = async () => {
    if (!selected.length) return setError(true);
    const res = await captureAndAlertRequestErrorHoc(
      updateUserRoles(
        id,
        selected.map((item) => item.role_id)
      )
    );
    if (res.status_code == 200) {
      setSuccessData({ title: "修改成功" });
      setSelected([]);
      onChange();
    }
  };

  return (
    <Dialog open={id} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t("system.roleSelect")}</DialogTitle>
        </DialogHeader>
        <div className="">
          <MultiSelect
            value={selected.map((item) => {
              return item.role_id.toString();
            })}
            options={roles.map((item) => {
              return {
                label: item.role_name,
                value: item.role_id.toString(),
              };
            })}
            placeholder="请选择角色"
            // lockedValues={["2"]}
            onChange={(values) => {
              setSelected(
                roles.filter((item) => {
                  return values.includes(item.role_id.toString());
                })
              );
            }}
          ></MultiSelect>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="h-10 w-[120px] px-16"
            onClick={handleCancel}
          >
            {t("cancel")}
          </Button>
          <Button className="h-10 w-[120px] px-16" onClick={handleSave}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
