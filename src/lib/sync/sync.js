import axios from "axios"

const backendUrl = "https://api-remind-me.delfi.dev/api/remind-me"

export async function createRemoteUser(uuid, device) {
    const result = await axios.get(backendUrl + "/users/" + uuid, {
        validateStatus: (status) => status === 404 || status === 200
    })
    if (result.status === 404) {
        const result2 = await axios.post(backendUrl + "/signup", {
            uuid: uuid
        })
        if (result2.status === 201) {
            return true
        }
    } else if (result.status === 200) {
        const result3 = await axios.post(backendUrl + "/users/" + uuid + "/device", {
            device: device
        })
        return true
    }
    return false
}

export async function getDevices(uuid) {
    const result = await axios.get(backendUrl + "/users/" + uuid)
    return result.data[0].devices.map((x) => JSON.parse(x))
}

export async function generateSyncPin(uuid) {
    try {
        const result = await axios.post(
            backendUrl + "/users/" + uuid + "/sync"
        );

        return result.data;

    } catch (e) {
        console.error("Could not generate sync pin: " + e)
        return false   
    }
}

export async function registerSyncPin(syncPin) {
    try {
        const result = await axios.post(backendUrl + "/pins/"+syncPin+"/login");
        console.log(result.data.uuid)
        return result.data.uuid
    } catch (e) {
        console.error("could not validate sync pin: "+e)
        return false
    }
}

export async function addDevice(uuid, device) {
    try {
        await axios.post(backendUrl + "/users/"+uuid+"/device", {
            device: device
        })
        return true
    } catch (e) {
        console.error("Could not add Device: "+ e)
        return false
    }
}