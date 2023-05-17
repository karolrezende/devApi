//CRIAÇÃO DE DESENVOLVEDOR
interface Tdeveloper {
    id: number,
    name: string,
    email: string
}

type TdeveloperRequest = Omit<Tdeveloper, "id">

//GETTER DE DESENVOLVEDOR POR ID

interface TgetId {
    developerId: number,
    developerName: string,
    developerEmail: string,
    developerInfoDeveloperSince?: Date | null ,
    developerInfoPreferredOS?: string | null
}

//UPDATER POR ID

interface Tupdater{
    id: number,
    name: string,
    email: string
}

type TupdaterRequest = Omit<Tupdater, "id">

//INSERT INFO 

interface TdeveloperInfo {
    id: number,
    developerSince: Date,
    preferredOS: "Windows" | "MacOS" | "Linux",
    developerId: number
}

type TdeveloperInfoRequest = Omit<TdeveloperInfo, "id">

export {Tdeveloper, 
    TdeveloperRequest,
    TgetId,
    Tupdater,
    TupdaterRequest,
    TdeveloperInfo,
    TdeveloperInfoRequest
}