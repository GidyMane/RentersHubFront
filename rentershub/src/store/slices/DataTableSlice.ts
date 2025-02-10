import { createSlice } from "@reduxjs/toolkit";
import { Satellite } from "lucide-react";

interface DataTableState {
  deletedata:any
  isdelete:boolean;
  deletefunc ?:any;
}

const initialState: DataTableState = {
    deletedata: [],
    isdelete: false
};

// export const fetchFeatures = createAsyncThunk('property/fetchFeatures', async () => {
//   // Replace with actual API call
//   const response = await fetch('/api/features');
//   return response.json();
// });

// export const fetchPropertyTypes = createAsyncThunk('property/fetchPropertyTypes', async () => {
//   // Replace with actual API call
//   const response = await fetch('/api/property-types');
//   return response.json();
// });

// export const fetchLocations = createAsyncThunk('property/fetchLocations', async () => {
//   // Replace with actual API call
//   const response = await fetch('/api/locations');
//   return response.json();
// });

// export const createProperty = createAsyncThunk(
//   'property/createProperty',
//   async (propertyData: PropertyFormValues, { rejectWithValue }) => {
//     try {
//       // Replace with actual API call
//       const response = await fetch('/api/properties', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(propertyData),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to create property');
//       }
//       return response.json();
//     } catch (error) {
//     //   return rejectWithValue(error.message);
//     }
//   }
// );

const datatableSlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setDeleteData:(state, action)=>{
        state.isdelete = !state.isdelete
        state.deletedata = action.payload.deletedata
        state.deletefunc = action.payload.deletefunc
    },
    clearDelete:(state)=>{
        state.isdelete =!state.isdelete
        state.deletedata={}
        state.deletefunc = async () => {};

    }
    
  },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFeatures.fulfilled, (state, action: PayloadAction<string[]>) => {
//         state.features = action.payload;
//       })
//       .addCase(fetchPropertyTypes.fulfilled, (state, action: PayloadAction<{ id: number; name: string }[]>) => {
//         state.propertyTypes = action.payload;
//       })
//       .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<{ id: number; name: string }[]>) => {
//         state.locations = action.payload;
//       })
//       .addCase(createProperty.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(createProperty.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createProperty.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       });
//   },
});


export const {setDeleteData, clearDelete} = datatableSlice.actions
export const datatableReducer = datatableSlice.reducer

