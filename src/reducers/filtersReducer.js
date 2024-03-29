export const types = {
   SET_FILTER: '[FILTERS] set filter value',

   RESET_FILTERS: '[FILTERS] reset filters value'
}



const initialState = {
   search: '',
   name: '',
   email: '',
   stateId: '',
   cityId: '',
   hasDeliveries: '',
   isPublic: '',
   date: '',
   companyId: '',
   userId: '',
   paymentTypeId: '',
   statusId: '',
}



export const filtersReducer = (state = initialState, action) => {
   switch (action.type) {
      case types.SET_FILTER:
         return {
            ...state,
            [action.payload.key]: action.payload.value
         }

      case types.RESET_FILTERS:
         return {
            ...initialState
         }

      default:
         return state;
   }
}