import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import Form from "../components/Form"

const Dashboard = () => {
  const [metrics, setMetrics] = useState([])
  const [salesReps, setSalesReps] = useState([])

  useEffect(() => {
    fetchMetrics()
    fetchSalesReps()

    const channel = supabase
      .channel("sales-deals-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales_deals",
        },
        (payload) => {
          console.log("Change received:", payload)
          fetchMetrics()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from("sales_deals")
        .select(`
          id,
          name,
          value,
          sales_rep_id,
          sales_reps (
            id,
            name
          )
        `)

      if (error) {
        throw error
      }

      const totals = data.reduce((acc, deal) => {
        const displayName = deal.sales_reps?.name || deal.name

        if (!displayName) {
          return acc
        }

        const existingMetric = acc.find((metric) => {
          return metric.name === displayName
        })

        if (existingMetric) {
          existingMetric.sum += Number(deal.value)
        } else {
          acc.push({
            name: displayName,
            sum: Number(deal.value),
          })
        }

        return acc
      }, [])

      console.log(totals)
      setMetrics(totals)
    } catch (error) {
      console.error("Error fetching metrics:", error.message)
    }
  }

  const fetchSalesReps = async () => {
    try {
      const { data, error } = await supabase
        .from("sales_reps")
        .select("id, name")

      if (error) {
        throw error
      }

      setSalesReps(data ?? [])
    } catch (error) {
      console.error("Error fetching sales reps:", error.message)
    }
  }

  const maxValue = Math.max(...metrics.map((metric) => metric.sum), 1)

  const generateBars = () => {
    return metrics.map((metric) => {
      const barHeight = `${(metric.sum / maxValue) * 100}%`

      return (
        <div className="chart-bar-container" key={metric.name}>
          <div className="chart-bar-wrapper">
            <div
              className="chart-bar"
              style={{ height: barHeight }}
              title={`${metric.name}: ${metric.sum}`}
            ></div>
          </div>

          <p className="chart-label">{metric.name}</p>
        </div>
      )
    })
  }

  return (
    <main>
      <section className="dashboard-card">
        <h2>Total Sales This Quarter ($)</h2>

        <div className="chart-container">
          <div className="chart-y-axis">
            <span>12,000</span>
            <span>10,000</span>
            <span>8,000</span>
            <span>6,000</span>
            <span>4,000</span>
            <span>2,000</span>
            <span>0</span>
          </div>

          <div className="chart-bars">{generateBars()}</div>
        </div>

        <Form salesReps={salesReps} />
      </section>
    </main>
  )
}

export default Dashboard