import { useState } from "react"

function Example() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function updateNameInDB(name) {
    return name
  }

  async function formAction(formData) {
    setLoading(true)
    setError(null)

    try {
      const newName = await updateNameInDB(formData.get("name"))
      setName(newName)
    } catch (error) {
      console.error(error.message)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form action={formAction}>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      {name && <p>Name: {name}</p>}
      {error && <p>{error.message}</p>}
    </>
  )
}

export default Example