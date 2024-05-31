import axios from "../request";
import { API_PREFIX } from "../constant";

const DIGITAL_ASSISTANT_PERMISSIONS_URL = `${API_PREFIX}/role_access/flow`
const KNOWLEDGE_PERMISSIONS_URL = `${API_PREFIX}/role_access/knowledge`
const ROLE_PERMISSIONS_URL = `${API_PREFIX}/role_access/list`
const UPDATE_PERMISSIONS_URL = `${API_PREFIX}/role_access/refresh`

type SearchParams = {
  role_id: string,
  pageSize: number,
  pageNum: number,
  name: string
}

// TODO: -- 暂时未使用
export async function getDigitalAssistantPermissions(data: SearchParams): Promise<String> {
  return await axios.get(DIGITAL_ASSISTANT_PERMISSIONS_URL, { params: data })
}

export async function getKnowledgePermissions(data: SearchParams): Promise<String> {
  return await axios.get(KNOWLEDGE_PERMISSIONS_URL, { params: data })
}

export async function getRolePermissions(data: SearchParams): Promise<{ company_id: string, company_name: string }> {
  return await axios.get(ROLE_PERMISSIONS_URL, { params: data })
}


/*
const data_use = { role_id: roleId.value, access_id: accessId.use_lib, type: ACCESS_TYPE.USE_LIB }
const data_manage = { role_id: roleId.value, access_id: accessId.manage_lib, type: ACCESS_TYPE.MANAGE_LIB }
*/

type ACCESS_TYPE = {
  USE_LIB: 1,
  USE_DIGITAL: 2,
  MANAGE_LIB: 3,
}

type Permission = {
  role_id: Number,
  access_id: number[],
  type: ACCESS_TYPE,
}

export async function updateRolePermissionsApi(data: Permission) {
    return await axios.post(UPDATE_PERMISSIONS_URL, data);
}
