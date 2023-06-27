'use client'

import { MeasurementChart } from '@/components/MeasurementChart'
import { Measurement } from '@/models/measurement'
import { MeasurementService } from '@/services/measurement'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [humidityMeasurements, setHumidityMeasurements] = useState<Measurement[]>([])
  const [temperatureMeasurements, setTemperatureMeasurements] = useState<Measurement[]>([])
  const [soilHumidityMeasurements, setSoilHumidityMeasurements] = useState<Measurement[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [screenWidth, setScreenWidth] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    setScreenWidth(window.innerWidth)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  function filterMeasurements(measurements: Measurement[]): Measurement[] {
    const filteredMeasurements = MeasurementService.filterByDate(measurements, startDate, endDate)
    const limit = Math.floor(screenWidth * 100 / 1920)
    return MeasurementService.limitMeasurements(filteredMeasurements, limit)
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
      <Link href='/measurement/temperature'>
        <h2>Dados do sensor de temperatura</h2>
      </Link>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Temperatura'
          color='#10ad25'
          measurements={filterMeasurements(temperatureMeasurements)}
        />
      </div>
      <Link href='/measurement/humidity'>
        <h2>Dados do sensor de umidade do ar</h2>
      </Link>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Umidade'
          color='#0d6efd'
          measurements={filterMeasurements(humidityMeasurements)}
        />
      </div>
      <Link href='/measurement/soilHumidity'>
        <h2>Dados do sensor de umidade do solo</h2>
      </Link>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label='Umidade do solo'
          color='#fd7e14'
          measurements={filterMeasurements(soilHumidityMeasurements)}
        />
      </div>
    </main>
  )
}