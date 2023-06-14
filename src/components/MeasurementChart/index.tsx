"use client"

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export interface Measurement {
  date: Date
  value: number
}

interface Props {
  label: string
  measurements: Measurement[]
}

export function MeasurementChart(props: Props) {
  const { measurements, label } = props

  const chartRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: measurements.map(measurement => measurement.date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })),
            datasets: [{
              label: label,
              data: measurements.map(measurement => measurement.value),
              backgroundColor: '#119411',
              borderColor: '#10ad25',
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })

        const resizeObserver = new ResizeObserver(() => {
          chart.resize()
        })

        resizeObserver.observe(chartRef.current)

        return () => {
          chart.destroy()
          resizeObserver.disconnect()
        }
      }
    }
  }, [measurements])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={chartRef} id="myChart" style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
