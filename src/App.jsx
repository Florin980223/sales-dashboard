import { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import "./App.css"
import { supabase } from "./supabaseClient"

function App() {
  const [salesReps, setSalesReps] = useState([])
  const [deals, setDeals] = useState([])
  const [selectedSalesRepId, setSelectedSalesRepId] = useState("")
  const [amount, setAmount] = useState(0)
  const [newPersonName, setNewPersonName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const { data: salesRepsData, error: salesRepsError } = await supabase
        .from("sales_reps")
        .select("*")
        .order("name", { ascending: true })

      if (salesRepsError) {
        console.error(salesRepsError)
      }

      const { data: dealsData, error: dealsError } = await supabase
        .from("deals")
        .select("*")

      if (dealsError) {
        console.error(dealsError)
      }

      setSalesReps(salesRepsData ?? [])
      setDeals(dealsData ?? [])

      if (salesRepsData != null && salesRepsData.length > 0) {
        setSelectedSalesRepId(salesRepsData[0].id)
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const chartData = useMemo(() => {
    return salesReps.map((rep) => {
      const total = deals
        .filter((deal) => deal.sales_rep_id === rep.id)
        .reduce((sum, deal) => sum + Number(deal.amount), 0)

      return {
        name: rep.name,
        amount: total,
      }
    })
  }, [salesReps, deals])

  async function handleAddDeal(e) {
    e.preventDefault()

    if (!selectedSalesRepId || Number(amount) <= 0) {
      return
    }

    const { data, error } = await supabase
      .from("deals")
      .insert({
        sales_rep_id: selectedSalesRepId,
        amount: Number(amount),
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    setDeals((currentDeals) => [...currentDeals, data])
    setAmount(0)
  }

  async function handleAddPerson(e) {
    e.preventDefault()

    const name = newPersonName.trim()

    if (!name) {
      return
    }

    const { data, error } = await supabase
      .from("sales_reps")
      .insert({
        name,
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    setSalesReps((currentSalesReps) => [...currentSalesReps, data])
    setSelectedSalesRepId(data.id)
    setNewPersonName("")
  }

  if (loading) {
    return <p className="loading">Loading...</p>
  }

  return (
    <main className="page">
Total Sales Dashboard Live ($)
      <section className="chart-card">
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="#eeeeee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="amount" fill="#55d36f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <form onSubmit={handleAddDeal} className="deal-form">
          <label htmlFor="sales-rep">Name:</label>

          <select
            id="sales-rep"
            value={selectedSalesRepId}
            onChange={(e) => setSelectedSalesRepId(e.target.value)}
          >
            {salesReps.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name}
              </option>
            ))}
          </select>

          <label htmlFor="amount">Amount: $</label>

          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

 
<button type="submit">Add Deal</button>

        </form>

        <form onSubmit={handleAddPerson} className="person-form">
          <label htmlFor="new-person">New person:</label>

          <input
            id="new-person"
            type="text"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            placeholder="Name"
          />

          <button type="submit">Add Person</button>
        </form>
      </section>
    </main>
  )
}

export default App
