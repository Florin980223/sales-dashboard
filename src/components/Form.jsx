import { useActionState } from "react"
import { supabase } from "../supabaseClient"

function Form({ salesReps }) {
  const safeSalesReps = salesReps ?? []

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const salesRepId = formData.get("name")
      const value = Number(formData.get("value"))

      if (!salesRepId || value <= 0) {
        return new Error("Please select a person and enter a valid amount")
      }

      const newDeal = {
        sales_rep_id: salesRepId,
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
    return safeSalesReps.map((rep) => (
      <option key={rep.id} value={rep.id}>
        {rep.name}
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