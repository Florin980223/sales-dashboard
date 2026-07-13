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

  const [personError, personSubmitAction, isPersonPending] = useActionState(
    async (previousState, formData) => {
      const name = (formData.get("person-name") || "").trim()

      if (!name) {
        return new Error("Please enter a name")
      }

      const { error } = await supabase.from("sales_reps").insert({ name })

      if (error) {
        console.error("Error adding person:", error.message)
        return new Error("Failed to add person")
      }

      window.location.reload()

      return null
    },
    null
  )

  return (
    <div className="forms-grid">
      <div className="form-card">
        <h3 className="form-card-title">Add Deal</h3>

        <form action={submitAction} className="modern-form">
          <div className="field">
            <label htmlFor="name">Name</label>
            <select id="name" name="name" disabled={isPending}>
              {generateOptions()}
            </select>
          </div>

          <div className="field">
            <label htmlFor="value">Amount ($)</label>
            <input
              id="value"
              name="value"
              type="number"
              defaultValue="0"
              disabled={isPending}
            />
          </div>

          <button disabled={isPending}>Add Deal</button>

          {error && <p className="form-error">{error.message}</p>}
        </form>
      </div>

      <div className="form-card">
        <h3 className="form-card-title">Add Person</h3>

        <form action={personSubmitAction} className="modern-form">
          <div className="field">
            <label htmlFor="person-name">Name</label>
            <input
              id="person-name"
              name="person-name"
              type="text"
              placeholder="e.g. Jim"
              disabled={isPersonPending}
            />
          </div>

          <button disabled={isPersonPending}>Add Person</button>

          {personError && <p className="form-error">{personError.message}</p>}
        </form>
      </div>
    </div>
  )
}

export default Form