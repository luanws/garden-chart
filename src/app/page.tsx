import { firebase } from '@/utils/firebase'
import styles from './page.module.css'
import * as firebaseDatabase from "firebase/database"
interface Props {
  data: any
}

const dataTypeDict = {
  temperature: 'temperatura',
  humidity: 'umidade',
  soilHumidity: 'umidade do solo',
}

interface Measurement {
  date: Date
  value: number
}

async function getData(dataType: keyof typeof dataTypeDict) {
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

export default async function Home(props: Props) {
  const humidityMeasurements = await getData('humidity')
  const temperatureMeasurements = await getData('temperature')
  const soilHumidityMeasurements = await getData('soilHumidity')

  console.log(humidityMeasurements)
  console.log(temperatureMeasurements)
  console.log(soilHumidityMeasurements)
  return (
    <main className={styles.main}>
      teste
    </main>
  )
}