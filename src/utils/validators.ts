/**
 * 验证钱包地址 (Ethereum 0x... format)
 * @param address 钱包地址
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 验证 JWT token 格式
 * @param token JWT token
 */
export function isValidJWTFormat(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * 验证模型名称
 * @param model 模型名称
 * @param allowedModels 允许的模型列表
 */
export function isValidModelName(model: string, allowedModels: string[]): boolean {
  return allowedModels.includes(model);
}

/**
 * 验证请求ID格式 (UUID v4)
 * @param id 请求ID
 */
export function isValidRequestId(id: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(id);
}
