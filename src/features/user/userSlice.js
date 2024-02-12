import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// fetchAddress 會是 action creator function
export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) 我們取得使用者的地理位置
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) 然後我們使用 reverse geocoding API 來獲取用戶地址的描述，以便我們可以將其顯示在訂單表單中，以便用戶可以在錯誤時進行更正
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 去除地址括號內容
    if (address.split('').indexOf('(') > 0) {
      const addressCutIndex = address.split('').indexOf('(');
      const newAddress = address.split('').slice(0, addressCutIndex).join('');
      return { position, address: newAddress };
    }

    // 3) payload of the FULFILLED state
    return { position, address };
  },
);

const initialState = {
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = 'idle';
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          'There was a problem getting your address, Make sure to fill the this field';
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;

export const getUsername = (state) => state.user.username;
