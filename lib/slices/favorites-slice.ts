import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FavoritesState {
  favoriteIds: string[]
}

const initialState: FavoritesState = {
  favoriteIds: [],
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload
      const index = state.favoriteIds.indexOf(recipeId)
      if (index >= 0) {
        state.favoriteIds.splice(index, 1)
      } else {
        state.favoriteIds.push(recipeId)
      }
    },
  },
})

export const { toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
