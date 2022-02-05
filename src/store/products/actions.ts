import { SET_FILTERED_PRODUCTS, SET_PRODUCTS, SET_SINGLE_PRODUCT } from "./type"
import Api from "../../common/helpers/Api"

export const getProducts = (onSuccess) => async (dispatch) => {
  try {
    const response = await Api.get("/products")
    dispatch({
      type: SET_PRODUCTS,
      payload: response.data,
    })
    dispatch({
      type: SET_FILTERED_PRODUCTS,
      payload: response.data,
    })
    onSuccess()
  } catch (error) {
    console.log(error)
  }
}

export const filterProducts = (params, onSuccess) => async (dispatch, getState) => {
  const products = getState().products.products
  let filteredProducts = [...products]

  if (params.q) {
    filteredProducts = products.filter((product) => {
      return product.title.toLowerCase().includes(params.q.toLowerCase())
    })
  }

  if (params.category) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.category.toLowerCase().includes(params.category.toLowerCase())
    })
  }

  if (params.sortBy) {
    filteredProducts = filteredProducts.sort((a, b) => {
      if (params.sortBy === "rating") {
        return b.rating.rate - a.rating.rate
      }
      if (params.sortBy === "price_low_high") {
        return a.price - b.price
      }
      if (params.sortBy === "price_high_low") {
        return b.price - a.price
      }

      return 1
    })
  }

  dispatch({
    type: SET_FILTERED_PRODUCTS,
    payload: filteredProducts,
  })
  // Just to mimic api call
  setTimeout(() => {
    onSuccess()
  }, 500)
}

export const getSingleProduct = (productId: number) => async (dispatch) => {
  try {
    const response = await Api.get(`/products/${productId}`)
    dispatch({
      type: SET_SINGLE_PRODUCT,
      payload: response.data,
    })
  } catch (error) {
    console.log(error)
  }
}
