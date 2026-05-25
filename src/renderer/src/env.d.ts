/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  electron: {
    platform: string
    setConfig: (key: string, value: any) => Promise<void>
    getConfig: (key: string) => Promise<any>
    copy2Clipboard: (data: string) => Promise<void>
    filterCodes: (
      codeList: string[],
      ruleList: any[],
      igCounts: number[],
      orderType: boolean
    ) => Promise<string[]>
    openWindow: (param: { title: string; url: string; width: number; height: number }) => Promise<void>
  }
}
