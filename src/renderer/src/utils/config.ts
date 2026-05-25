export const getConfigList = async (): Promise<any[]> => {
  const configList = await window.electron.getConfig('configList')
  return configList || []
}

export const setConfigList = async (configList: any[]): Promise<void> => {
  await window.electron.setConfig('configList', configList)
}
