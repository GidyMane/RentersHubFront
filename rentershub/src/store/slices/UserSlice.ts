import { createSlice } from "@reduxjs/toolkit";

interface PropertyState {
  editdata:any;
  isedit:boolean;
  isadd:boolean;
  page:string;
}

const initialState: PropertyState = {
  editdata:{},
  isadd:false,
  isedit:false,
  page:''
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

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setEditData:(state, action)=>{
        state.isedit = !state.isedit
        state.editdata = action.payload.data
        state.page = action.payload.page
    },
    setIsAdd:(state)=>{
        state.isadd = !state.isadd
    },
    clearEditData:(state)=>{
        state.isedit =!state.isedit
        state.editdata ={}
        state.page= ""
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

export const {setEditData, clearEditData, setIsAdd} = propertySlice.actions
export const propertyReducer = propertySlice.reducer

