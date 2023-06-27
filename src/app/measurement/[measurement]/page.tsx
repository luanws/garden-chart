'use client'

import { MeasurementChart } from "@/components/MeasurementChart"
import { Measurement } from "@/models/measurement"
import { MeasurementService } from "@/services/measurement"
import { useEffect, useState } from "react"
import styles from './page.module.css'

interface Props {
  params: {
    measurement: string
  }
}

export default function ChartPage(props: Props) {
  const { params } = props
  const { measurement: measurementType } = params
  const measurementName = MeasurementService.getMeasurementNameByType(measurementType as any)
  const color = MeasurementService.getMeasurementColorByType(measurementType as any)

  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [screenWidth, setScreenWidth] = useState<number>(0)

  const todayMeasurements = filterMeasurements(measurements, { limitEnabled: true, startDate: new Date(new Date().setHours(0, 0, 0, 0)) })
  const weekMeasurements = filterMeasurements(measurements, { limitEnabled: true, startDate: new Date(new Date().setDate(new Date().getDate() - 7)) })

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
    const clearListenHumidity = MeasurementService.listenData(measurementType as any, setMeasurements)
    return () => {
      clearListenHumidity()
    }
  }, [])

  function filterMeasurements(measurements: Measurement[], filters: { startDate?: Date, endDate?: Date, limitEnabled: boolean }): Measurement[] {
    const { startDate, endDate, limitEnabled } = filters
    const filteredMeasurements = MeasurementService.filterByDate(measurements, startDate, endDate)
    if (!limitEnabled) return filteredMeasurements
    const limit = Math.floor(screenWidth * 100 / 1920)
    return MeasurementService.limitMeasurements(filteredMeasurements, limit)
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{measurementName}</h1>
      <h2>Dados de hoje</h2>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label={measurementName}
          color={color}
          measurements={todayMeasurements}
        />
      </div>
      <h2>Dados da semana</h2>
      <div className={styles.chartContainer}>
        <MeasurementChart
          label={measurementName}
          color={color}
          measurements={weekMeasurements}
        />
      </div>
    </main>
  )
}