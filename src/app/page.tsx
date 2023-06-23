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
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

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

  function filterMeasurements(measurements: Measurement[]) {
    return measurements.filter(measurement => {
      if (startDate === null) return true
      return measurement.date.getTime() >= startDate.getTime()
    }).filter(measurement => {
      if (endDate === null) return true
      return measurement.date.getTime() <= endDate.getTime()
    })
  }

  return (
    <main className={styles.main}>
      <div className={styles.dateInputsContainer}>
        <input
          className={styles.dateInput}
          type="datetime-local"
          onChange={event => setStartDate(new Date(event.target.value))}
        />
        <input
          className={styles.dateInput}
          type="datetime-local"
          onChange={event => setEndDate(new Date(event.target.value))}
        />
      </div>
      <h2>Dados do sensor de umidade</h2>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Umidade'
          measurements={filterMeasurements(humidityMeasurements)}
        />
      </div>
      <h2>Dados do sensor de temperatura</h2>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Temperatura'
          measurements={filterMeasurements(temperatureMeasurements)}
        />
      </div>
      <h2>Dados do sensor de umidade do solo</h2>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Umidade do solo'
          measurements={filterMeasurements(soilHumidityMeasurements)}
        />
      </div>
    </main>
  )
}