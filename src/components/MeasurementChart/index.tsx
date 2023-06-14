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
            labels: measurements.map(measurement => measurement.date.toLocaleString('en-US', { month: 'short' })),
            datasets: [{
              label: label,
              data: measurements.map(measurement => measurement.value),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
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
