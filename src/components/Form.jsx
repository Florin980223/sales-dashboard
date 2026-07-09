import { useActionState } from "react"
import { supabase } from "../supabaseClient"
import { useAuth } from "../context/AuthContext"

function Form({ metrics }) {
  const { users } = useAuth()

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const submittedName = formData.get("name")
      const user = users.find((u) => u.name === submittedName)

      const newDeal = {
        user_id: user.id,
        value: formData.get("value"),
      }

      console.log("newDeal", newDeal)

      const { error } = await supabase.from("sales_deals").insert(newDeal)

      if (error) {
        console.error("Error adding deal: ", error.message)
        return new Error("Failed to add deal")
      }

      return null
    },
    null
  )

  const generateOptions = () => {
    return users.map((user) => (
      <option key={user.id} value={user.name}>
        {user.name}
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