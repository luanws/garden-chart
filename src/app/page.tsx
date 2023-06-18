'use client'

import { MeasurementChart } from '@/components/MeasurementChart'
import { Measurement } from '@/models/measurement'
import { MeasurementService } from '@/services/measurement'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [humidityMeasurements, setHumidityMeasurements] = useState<Measurement[]>([])
  const [temperatureMeasurements, setTemperatureMeasurements] = useState<Measurement[]>([])
  const [soilHumidityMeasurements, setSoilHumidityMeasurements] = useState<Measurement[]>([])

  useEffect(() => {
    const clearListenHumidity = MeasurementService.listenData('humidity', setHumidityMeasurements)
    const clearListenTemperature = MeasurementService.listenData('temperature', setTemperatureMeasurements)
    const clearListenSoilHumidity = MeasurementService.listenData('soilHumidity', setSoilHumidityMeasurements)
    return () => {
      clearListenHumidity()
      clearListenTemperature()
      clearListenSoilHumidity()
    }
  }, [])

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