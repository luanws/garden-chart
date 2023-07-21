'use client'

import { MeasurementChart } from '@/components/MeasurementChart'
import { Measurement } from '@/models/measurement'
import { MeasurementService } from '@/services/measurement'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

interface ChartView {
  measurementType: MeasurementService.MeasurementType
  label: string
  measurements: Measurement[]
}

export default function Home() {
  const [humidityMeasurements, setHumidityMeasurements] = useState<Measurement[]>([])
  const [temperatureMeasurements, setTemperatureMeasurements] = useState<Measurement[]>([])
  const [soilHumidityMeasurements, setSoilHumidityMeasurements] = useState<Measurement[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [screenWidth, setScreenWidth] = useState<number>(0)

  const charts: ChartView[] = [
    {
      measurementType: 'temperature',
      label: 'temperatura',
      measurements: temperatureMeasurements
    },
    {
      measurementType: 'humidity',
      label: 'umidade',
      measurements: humidityMeasurements
    },
    {
      measurementType: 'soilHumidity',
      label: 'umidade do solo',
      measurements: soilHumidityMeasurements
    },
  ]

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
      {charts.map(chart =>
        <>
          <Link href={`/measurement/${chart.measurementType}`}>
            <h2>Dados do sensor de {chart.label}</h2>
          </Link>
          <div className={styles.chartContainer}>
            <MeasurementChart
              label={chart.label}
              color={MeasurementService.getMeasurementColorByType(chart.measurementType)}
              measurements={filterMeasurements(chart.measurements)}
            />
          </div>
        </>
      )}
    </main>
  )
}