import isElectron from "is-electron";

class DeviceModel {
    name
    platform
    os
    osVersion
    constructor(name, platform, os, osVersion) {
        this.name = name
        this.platform = platform
        this.os = os
        this.osVersion = osVersion
    }
}

export async function getDeviceInfo() {
    if (isElectron()) {
        const name = await window.sys.hostname()
        const platform = await window.sys.platform() + await window.sys.arch()
        let os = "Unknown";
        let osVersion = "?";
        if (await window.sys.platform() === "linux") {
            const linuxOsInfo = await window.sys.linuxOsInfo()
            osVersion = linuxOsInfo.version
            os = linuxOsInfo.name
        } else {
            os = await window.sys.type()
            osVersion = await window.sys.version()
        }
        return new DeviceModel(name, platform, os, osVersion)
    } else {
        const { Device } = await import('@capacitor/device')
        const info = await Device.getInfo()
        return new DeviceModel(info.name, info.platform, String(info.operatingSystem).charAt(0).toUpperCase() + String(info.operatingSystem).slice(1), info.osVersion)
    }
}