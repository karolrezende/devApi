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
export {Tdeveloper, 
    TdeveloperRequest,
    TgetId
}