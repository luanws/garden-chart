import { Measurement } from '@/models/measurement'
import { firebase } from '@/utils/firebase'
import * as firebaseDatabase from "firebase/database"

export namespace MeasurementService {
    const dataTypeDict = {
        temperature: 'temperatura',
        humidity: 'umidade',
        soilHumidity: 'umidade do solo',
    }

    export function limitMeasurements(measurements: Measurement[], limit: number): Measurement[] {
        const length = measurements.length
        return measurements.filter((measurement, index) => {
            return index % Math.ceil(length / limit) === 0
        })
    }

    export function filterByDate(measurements: Measurement[], startDate?: Date, endDate?: Date): Measurement[] {
        return measurements.filter(measurement => {
            if (startDate === undefined) return true
            return measurement.date.getTime() >= startDate.getTime()
        }).filter(measurement => {
            if (endDate === undefined) return true
            return measurement.date.getTime() <= endDate.getTime()
        })
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