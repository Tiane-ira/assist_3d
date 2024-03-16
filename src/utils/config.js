export const getConfigList = async () => {
  let configList = await window.electron.getConfig("configList");
  return configList || [];
};

export const setConfigList = async (configList) => {
  await window.electron.setConfig("configList", configList);
};
