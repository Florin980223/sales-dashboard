import { useActionState } from "react"
import { supabase } from "../supabaseClient"

function Form({ metrics }) {
  const safeMetrics = metrics ?? []

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const submittedName = formData.get("name")
      const value = Number(formData.get("value"))

      if (!submittedName || value <= 0) {
        return new Error("Please select a person and enter a valid amount")
      }

      const selectedMetric = safeMetrics.find(
        (metric) => metric.name === submittedName
      )

      if (!selectedMetric) {
        return new Error("Selected person was not found")
      }

      const userId =
        selectedMetric.user_id ??
        selectedMetric.id ??
        selectedMetric.userId

      if (!userId) {
        console.error("Selected metric does not contain a user id:", selectedMetric)
        return new Error("Selected person does not have a user id")
      }

      const newDeal = {
        user_id: userId,
        value,
      }

      const { error } = await supabase.from("sales_deals").insert(newDeal)

      if (error) {
        console.error("Error adding deal:", error.message)
        return new Error("Failed to add deal")
      }

      window.location.reload()

      return null
    },
    null
  )

  const generateOptions = () => {
    return safeMetrics.map((metric) => (
      <option key={metric.name} value={metric.name}>
        {metric.name}
      </option>
    ))
  }

  return (
    <form action={submitAction}>
      <label htmlFor="name">Name: </label>

      <select id="name" name="name" disabled={isPending}>
        {generateOptions()}
      </select>

      <label htmlFor="value">Amount: $</label>

      <input
        id="value"
        name="value"
        type="number"
        defaultValue="0"
        disabled={isPending}
      />

      <button disabled={isPending}>Add Deal</button>

      {error && <p>{error.message}</p>}
    </form>
  )
}

export default Form