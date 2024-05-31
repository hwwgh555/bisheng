import { CopyIcon } from "@/components/bs-icons/copy";
import { Button } from "@/components/bs-ui/button";
import { Input } from "@/components/bs-ui/input";
import { alertContext } from "@/contexts/alertContext";
import {
  getCompanyInfo,
  getCompanyLogo,
  setCompanyConfig,
} from "@/controllers/API/company";
import { copyText } from "@/utils";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Item from "./Item";

const NAME_MAX_LENGTH = 50;
const DEFAULT_CODE = "********-****-****-****-************";
const IMG_FORMATS = ["image/jpeg", "image/png"];

export default function Config() {
  const { setErrorData, setSuccessData } = useContext(alertContext);
  const [imageUrl, setImageUrl] = useState("");
  const [imageRawFile, setImageRawFile] = useState<File>();
  const [companyName, setCompanyName] = useState("");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isShowTip, setIsShowTip] = useState(false);
  const [tip, setTip] = useState("企业名称已存在，请更改名称。");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const getCompanyInitInfo = async () => {
    const { company_id, company_name } = await getCompanyInfo();
    setCode(company_id);
    setCompanyName(company_name);
  };

  const getLogo = async () => {
    const blob = await getCompanyLogo();
    setImageUrl(URL.createObjectURL(blob));
  };

  useEffect(() => {
    getCompanyInitInfo();
    getLogo();
  }, []);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const rawFile = event.target.files![0];
    if (rawFile.size / 1024 / 1024 > 10) {
      setErrorData({ title: "图片大小不能超过10MB!" });
      return false;
    }
    setImageRawFile(rawFile);
    setImageUrl(URL.createObjectURL(rawFile));
    return false;
  };

  const getIsValid = () => {
    if (!imageUrl) {
      setErrorData({ title: "请选择企业图标文件!" });
      return false;
    }
    const length = companyName.trim().length;
    if (length == 0) {
      setErrorData({ title: "请输入企业名称!" });
      return false;
    }
    if (length > NAME_MAX_LENGTH) {
      setErrorData({ title: `名字超出${NAME_MAX_LENGTH}长度!` });
      return false;
    }
    return true;
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length > NAME_MAX_LENGTH) {
      return;
    }
    setCompanyName(value);
  };

  const handleSave = async () => {
    if (loading) return;
    if (!getIsValid()) return;
    setLoading(true);
    try {
      const res = await setCompanyConfig({
        companyName,
        imageRawFile,
      });

      setLoading(false);
      if (res.status_code == 500) {
        setIsShowTip(true);
        setTip(res.status_message);
        return;
      } else {
        setIsShowTip(false);
        setSuccessData({ title: "保存成功" });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file:", error);
    }
  };

  const handleCopy = (val: string) => {
    copyText(val);
    setSuccessData({ title: "复制成功" });
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <Item title="企业邀请码">
        <div className="flex h-[140px] flex-col items-start justify-start gap-6 self-stretch bg-slate-50 p-6">
          <div className="inline-flex items-center justify-start gap-3.5">
            <div className="text-4xl font-medium leading-[46px] text-blue-500">
              {code}
            </div>
            <div className="relative h-6 w-6" onClick={() => handleCopy(code)}>
              <CopyIcon className="absolute left-[3px] top-[3px] h-[19px] w-[19px] cursor-pointer text-[#697B98] hover:text-primary" />
            </div>
          </div>
          <div className="text-sm text-zinc-700 ">
            您可以发送该邀请码给已注册用户，用户可使用该邀请码加入您的企业空间。
          </div>
        </div>
      </Item>
      <Item title="企业图标">
        <div className="flex flex-col items-start justify-start gap-1">
          <div className="inline-flex items-start justify-start gap-3 ">
            <label
              htmlFor="upload"
              className="group inline-flex h-[120px] w-[120px] cursor-pointer flex-col items-center justify-center gap-3 rounded border border-dashed border-neutral-200 bg-white px-[43px] py-3 hover:border-primary"
            >
              <div className="relative h-7 w-7">
                <div className="absolute left-0 top-[13px] h-0.5 w-7 rounded-sm bg-gray-400 group-hover:bg-primary" />
                <div className="absolute left-[15px] top-0 h-0.5 w-7 origin-top-left rotate-90 rounded-sm bg-gray-400 group-hover:bg-primary" />
              </div>
              <div className="text-sm font-normal text-gray-400 group-hover:text-primary">
                上传
              </div>
              <input
                id="upload"
                type="file"
                className="hidden"
                accept={IMG_FORMATS.join(",")}
                onChange={handleUpload}
              />
            </label>
            <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-slate-50">
              <div className="w-full  rounded-full">
                <img className="w-full" src={imageUrl} />
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400 ">请上传10M以内的jpg或png</div>
        </div>
      </Item>
      <Item title="企业名称">
        <div className="relative">
          <Input
            type="text"
            placeholder="请输入角色名称"
            value={companyName}
            className="w-[500px]"
            onChange={handleInput}
          />
          <div className="absolute right-[16px] top-[10px] text-xs text-gray-400">
            {companyName.length}/50
          </div>
          {isShowTip && <div className="mt-1 text-xs text-red-500">{tip}</div>}
        </div>
      </Item>
      <div className="mt-3">
        <Button className="w-[100px]" disabled={loading} onClick={handleSave}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
