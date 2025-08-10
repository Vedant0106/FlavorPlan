"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import RecipeApp from "@/components/recipe-app"

export default function Home() {
  return (
    <Provider store={store}>
      <RecipeApp />
    </Provider>
  )
}
