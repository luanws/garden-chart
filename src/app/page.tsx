import { MeasurementChart } from '@/components/MeasurementChart'
import { Measurement } from '@/models/measurement'
import { firebase } from '@/utils/firebase'
import * as firebaseDatabase from "firebase/database"
import styles from './page.module.css'

export const revalidate = 1

const dataTypeDict = {
  temperature: 'temperatura',
  humidity: 'umidade',
  soilHumidity: 'umidade do solo',
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

export default async function Home() {
  const [
    humidityMeasurements,
    temperatureMeasurements,
    soilHumidityMeasurements,
  ] = await Promise.all([
    getData('humidity'),
    getData('temperature'),
    getData('soilHumidity'),
  ])

  return (
    <main className={styles.main}>
      <h2>Dados do sensor de umidade</h2>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Umidade'
          measurements={humidityMeasurements}
        />
      </div>
      <h2>Dados do sensor de temperatura</h2>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Temperatura'
          measurements={temperatureMeasurements}
        />
      </div>
      <h2>Dados do sensor de umidade do solo</h2>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Umidade do solo'
          measurements={soilHumidityMeasurements}
        />
      </div>
    </main>
  )
}