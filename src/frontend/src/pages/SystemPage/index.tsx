import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import Company from "./components/Company";
import Config from "./components/Config";
import Permissions from "./components/Permissions";
import Roles from "./components/Roles";
import Users from "./components/Users";

const TAB_COMPANY = "company";
const TAB_AUTH = "auth";

export default function FileLibPage() {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full px-6 py-2">
      <Tabs defaultValue={TAB_COMPANY} className="w-full">
        <TabsList className="">
          <TabsTrigger value={TAB_COMPANY}>企业管理</TabsTrigger>
          <TabsTrigger value="user" className="roundedrounded-xl">
            {t("system.userManagement")}
          </TabsTrigger>
          <TabsTrigger value="role">{t("system.roleManagement")}</TabsTrigger>
          <TabsTrigger value={TAB_AUTH}>权限管理</TabsTrigger>
          <TabsTrigger value="system">
            {t("system.systemConfiguration")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TAB_COMPANY}>
          <Company />
        </TabsContent>
        <TabsContent value="user">
          <Users></Users>
        </TabsContent>
        <TabsContent value="role">
          <Roles />
        </TabsContent>
        <TabsContent value={TAB_AUTH}>
          <Permissions />
        </TabsContent>
        <TabsContent value="system">
          <Config></Config>
        </TabsContent>
      </Tabs>
    </div>
  );
}
