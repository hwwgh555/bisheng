
import axios from "../request";
import { API_PREFIX } from "../constant";

const LOGO_URL = `${API_PREFIX}/company/logo`
const COMPANY_INFO_URL = `${API_PREFIX}/company`
const COMPANY_UPDATE_URL = `${API_PREFIX}/company/update`

type Res = {
  status_code: number,
  status_message: string,
  data: object,
}

type CompanyInfo = {
  company_id: string, // 邀请码
  company_name: string, // 公司名
}
export async function getCompanyInfo(): Promise<CompanyInfo> {
  return await axios.get(COMPANY_INFO_URL)
}

export async function getCompanyLogo(): Promise<Blob> {
  return await axios.get(LOGO_URL, {
    responseType: "blob",
  })
}

export async function setCompanyConfig(data: {imageRawFile: Blob, companyName: string}): Promise<Res> {
    const formData = new FormData()
    formData.append("file", data.imageRawFile)
    formData.append("company_name", data.companyName)
    const config = {
      headers: { "Content-Type": "multipart/form-data;charset=utf-8" },
    }
    return await axios.post(COMPANY_UPDATE_URL, formData, config)
}