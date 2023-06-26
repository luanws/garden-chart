'use client'

import Chart from 'chart.js/auto'
import { useEffect, useRef } from 'react'

export interface Measurement {
  date: Date
  value: number
}

interface Props {
  label: string
  measurements: Measurement[]
  color: string
}

function formatDate(date: Date): string {
  return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function MeasurementChart(props: Props) {
  const { measurements, label, color } = props

  const chartRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: measurements.map(measurement => formatDate(measurement.date)),
            datasets: [{
              label: label,
              data: measurements.map(measurement => measurement.value),
              backgroundColor: color,
              borderColor: color,
              borderWidth: 2,
              tension: 0.3,
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
