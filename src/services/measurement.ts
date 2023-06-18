import { Measurement } from '@/models/measurement'
import { firebase } from '@/utils/firebase'
import * as firebaseDatabase from "firebase/database"

export namespace MeasurementService {
    const dataTypeDict = {
        temperature: 'temperatura',
        humidity: 'umidade',
        soilHumidity: 'umidade do solo',
    }

    export async function getData(dataType: keyof typeof dataTypeDict) {
        const rootRef = firebaseDatabase.ref(firebase.database, `/dados/${dataTypeDict[dataType]}`)
        const snapshot = await firebaseDatabase.get(rootRef)
        const val = snapshot.val()
        return Object.entries(val).map(([key, value]) => value).map(value => {
            const { dataHora, valor } = value as any
            const measurement: Measurement = {
                date: new Date(parseInt(dataHora) * 1000),
                value: valor
            }
            return measurement
        })
    }

    export function listenData(dataType: keyof typeof dataTypeDict, callback: (measurements: Measurement[]) => void) {
        const rootRef = firebaseDatabase.ref(firebase.database, `/dados/${dataTypeDict[dataType]}`)
        firebaseDatabase.onValue(rootRef, snapshot => {
            const val = snapshot.val()
            const measurements = Object.entries(val).map(([key, value]) => value).map(value => {
                const { dataHora, valor } = value as any
                const measurement: Measurement = {
                    date: new Date(parseInt(dataHora) * 1000),
                    value: valor
                }
                return measurement
            })
            callback(measurements)
        })

        return () => {
            firebaseDatabase.off(rootRef)
        }
    }
}