import { Button } from "@/components/bs-ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/bs-ui/dialog";
import { Input, Textarea } from "@/components/bs-ui/input";
import { alertContext } from "@/contexts/alertContext";
import { createRole, updateRoleNameApi } from "@/controllers/API/user";
import type { Role } from "@/types/api/user";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_MODAL_ROLE } from ".";

function Index({ visible, info, hideModal, onConfirm }) {
  const { t } = useTranslation();
  const { setErrorData, setSuccessData } = useContext(alertContext);
  const [role, setRole] = useState<Partial<Role>>(DEFAULT_MODAL_ROLE);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole({ ...info });
  }, [info.id]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const value = e.target.value;
    setRole({ ...role, [name]: value });
  };

  const [error, setError] = useState({ name: false });

  const getIsValid = (): boolean => {
    if (role.role_name.trim() === "") {
      setError({ ...error, name: true });
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    hideModal();
  };

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (info?.id) {
        await updateRoleNameApi(info.id, role.role_name, role.remark);
        setLoading(false);
        setSuccessData({ title: "修改成功" });
        onConfirm();
        return;
      }
      await createRole(role.role_name, role.remark);
      setLoading(false);
      setSuccessData({ title: "创建成功" });
      onConfirm();
    } catch (error) {
      setErrorData({ title: error || "出错了" });
      setLoading(false);
    }
  };

  const title = info.id ? "编辑角色" : "创建角色";

  return (
    <Dialog open={visible} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="">
            <label className="bisheng-label required">
              角色名称<span className="bisheng-tip">*</span>
            </label>
            <Input
              value={role.role_name}
              onChange={(e) => handleInput(e, "role_name")}
              placeholder={"请输入名称"}
              className={`col-span-3 ${error.name && "border-red-400"}`}
            />
          </div>
          <div className="">
            <label className="bisheng-label">备注</label>
            <Textarea
              value={role.remark}
              onChange={(e) => handleInput(e, "remark")}
              placeholder={"请输入备注"}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              variant="outline"
              className="px-11"
              type="button"
              onClick={handleCancel}
            >
              取消
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={loading}
            className="px-11"
            onClick={handleConfirm}
          >
            {t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Index;
