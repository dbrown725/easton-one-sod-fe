import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const issueCountSlice = createSlice({
  name: 'issueCount',
  initialState,
  reducers: {
    setIssueCount: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setIssueCount } = issueCountSlice.actions

export default issueCountSlice.reducer