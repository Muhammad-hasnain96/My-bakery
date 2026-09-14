import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { branches, products } from '@/data/products'
import { API_BASE } from '@/lib/api'

// Haversine distance calculation in kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Convert GPS Coordinates to real Street/Colony/Town address using OpenStreetMap Reverse Geocoding
export async function reverseGeocodeAddress(lat, lng, defaultCity = '') {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4500)

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      }
    )
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (data && data.address) {
        const addr = data.address
        const parts = []

        // Road or street or building
        const road = addr.road || addr.street || addr.footway || addr.path
        if (road) parts.push(road)

        // Colony, neighborhood, residential area, or sector
        const colony =
          addr.neighbourhood ||
          addr.suburb ||
          addr.residential ||
          addr.quarter ||
          addr.block

        if (colony && !parts.includes(colony)) parts.push(colony)

        // Town or Tehsil
        const town = addr.town || addr.city_district
        if (town && !parts.includes(town)) parts.push(town)

        // City
        const city = addr.city || addr.town || defaultCity
        if (city && !parts.includes(city)) parts.push(city)

        if (parts.length > 0) {
          return parts.join(', ')
        }

        if (data.display_name) {
          // Take first 3 descriptive segments from display_name
          return data.display_name.split(',').slice(0, 3).map(s => s.trim()).join(', ')
        }
      }
    }
  } catch (e) {
    console.warn('Reverse geocoding fetch issue:', e)
  }

  // Fallback if network is slow or offline
  return `Near ${defaultCity || 'Current Location'} (GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`
}

// Maximum allowed delivery radius in Kilometers
export const MAX_DELIVERY_RADIUS_KM = 10

// Forward Geocoding: address text -> GPS coords
export async function geocodeAddress(address, city = '') {
  if (!address || address.trim().length < 3) return null
  try {
    const query = `${address}, ${city}, Pakistan`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4500)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      }
    )
    clearTimeout(timeoutId)
    if (response.ok) {
      const data = await response.json()
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
        }
      }
    }
  } catch (e) {
    console.warn('Geocoding address error:', e)
  }
  return null
}

// Check if a customer delivery is eligible (under 10 km and same city)
export function checkDeliveryEligibility(branch, userCoords, customerCity = '') {
  if (!branch) {
    return {
      eligible: false,
      reason: 'no_branch',
      message: 'Please select a branch to proceed.',
      distanceKm: null,
      maxRadiusKm: MAX_DELIVERY_RADIUS_KM,
    }
  }

  // 1. City boundary check
  const branchCity = (branch.city || '').toLowerCase().trim()
  const custCity = (customerCity || '').toLowerCase().trim()
  if (branchCity && custCity && branchCity !== custCity) {
    return {
      eligible: false,
      reason: 'out_of_city',
      message: `Selected branch (${branch.name}) is located in ${branch.city} and cannot deliver to ${customerCity}. Delivery is strictly restricted to ${branch.city} within 10 km.`,
      distanceKm: null,
      maxRadiusKm: MAX_DELIVERY_RADIUS_KM,
      branchCity: branch.city,
      customerCity,
    }
  }

  // 2. Distance check if coordinates are present
  if (userCoords?.lat && userCoords?.lng && branch?.coords?.lat && branch?.coords?.lng) {
    const dist = Math.round(calculateDistanceKm(userCoords.lat, userCoords.lng, branch.coords.lat, branch.coords.lng) * 10) / 10
    if (dist > MAX_DELIVERY_RADIUS_KM) {
      return {
        eligible: false,
        reason: 'exceeds_radius',
        distanceKm: dist,
        maxRadiusKm: MAX_DELIVERY_RADIUS_KM,
        message: `Delivery unavailable: Your location is ${dist} km away from ${branch.name}. We strictly deliver within a ${MAX_DELIVERY_RADIUS_KM} km radius. Please choose Store Pickup instead.`,
      }
    }
    return {
      eligible: true,
      reason: 'ok',
      distanceKm: dist,
      maxRadiusKm: MAX_DELIVERY_RADIUS_KM,
      message: `Within 10 km delivery zone (${dist} km from ${branch.name}).`,
    }
  }

  // Coordinates not yet detected, but same city
  return {
    eligible: true,
    reason: 'city_matched_unverified_coords',
    distanceKm: null,
    maxRadiusKm: MAX_DELIVERY_RADIUS_KM,
    message: `Delivery available in ${branch.city} within ${MAX_DELIVERY_RADIUS_KM} km of ${branch.name}.`,
  }
}

export const useLocationStore = defineStore('location', () => {
  const savedBranch = JSON.parse(localStorage.getItem('selectedBranch') || 'null')
  const defaultBranch = branches.find(b => b.id === 'fsd-kohinoor') || branches[0]
  
  const selectedBranch = ref(savedBranch || defaultBranch)
  const selectedCity = ref(localStorage.getItem('selectedCity') || (selectedBranch.value ? selectedBranch.value.city : 'Faisalabad'))
  
  const userCoordinates = ref(JSON.parse(localStorage.getItem('userCoordinates') || 'null'))
  const deliveryAddress = ref(localStorage.getItem('deliveryAddress') || '')
  const isLocating = ref(false)
  const locationError = ref('')
  const detectedDistance = ref(null)

  const liveBranchProducts = ref([])

  // Fetch live products for selected branch from backend (reflects real-time inventory toggling)
  async function fetchBranchProducts() {
    try {
      const bId = selectedBranch.value?.id || ''
      const res = await fetch(`${API_BASE}/products?branchId=${bId}`)
      if (res.ok) {
        liveBranchProducts.value = await res.json()
      }
    } catch (e) {
      console.warn('Could not fetch branch products from backend, using fallback data:', e)
    }
  }

  // Initialize immediately
  fetchBranchProducts()

  // Compute products available at currently selected branch
  const branchProducts = computed(() => {
    if (liveBranchProducts.value && liveBranchProducts.value.length > 0) {
      return liveBranchProducts.value
    }
    if (!selectedBranch.value) return products
    const bId = selectedBranch.value.id
    return products.filter(p => !p.branchIds || p.branchIds.includes(bId))
  })

  // Find nearest branch to coordinates
  function findNearestBranch(latitude, longitude) {
    let nearest = null
    let minDistance = Infinity

    branches.forEach(branch => {
      if (branch.coords) {
        const dist = calculateDistanceKm(latitude, longitude, branch.coords.lat, branch.coords.lng)
        if (dist < minDistance) {
          minDistance = dist
          nearest = { ...branch, distanceKm: Math.round(dist * 10) / 10 }
        }
      }
    })

    return { branch: nearest, distanceKm: Math.round(minDistance * 10) / 10 }
  }

  // Request browser geolocation, resolve real street/colony address, and select nearest branch
  function detectLiveLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        locationError.value = 'Geolocation is not supported by your browser'
        reject(new Error(locationError.value))
        return
      }

      isLocating.value = true
      locationError.value = ''

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          userCoordinates.value = { lat, lng }
          localStorage.setItem('userCoordinates', JSON.stringify({ lat, lng }))

          const result = findNearestBranch(lat, lng)
          if (result.branch) {
            setBranch(result.branch)
            detectedDistance.value = result.distanceKm
            
            // Resolve actual street, colony and town address
            const properAddress = await reverseGeocodeAddress(lat, lng, result.branch.city)
            setDeliveryAddress(properAddress)

            isLocating.value = false
            resolve({
              branch: result.branch,
              distanceKm: result.distanceKm,
              coords: { lat, lng },
              deliveryAddress: properAddress,
            })
          } else {
            isLocating.value = false
            resolve(null)
          }
        },
        (err) => {
          isLocating.value = false
          let msg = 'Unable to retrieve location'
          if (err.code === 1) msg = 'Location permission was denied'
          else if (err.code === 2) msg = 'Location is unavailable'
          else if (err.code === 3) msg = 'Location request timed out'
          locationError.value = msg
          reject(new Error(msg))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    })
  }

  function setBranch(branch) {
    selectedBranch.value = branch
    selectedCity.value = branch.city
    localStorage.setItem('selectedBranch', JSON.stringify(branch))
    localStorage.setItem('selectedCity', branch.city)

    // Recalculate distance to this branch if user GPS is known
    if (userCoordinates.value && branch?.coords) {
      const dist = calculateDistanceKm(
        userCoordinates.value.lat,
        userCoordinates.value.lng,
        branch.coords.lat,
        branch.coords.lng
      )
      detectedDistance.value = Math.round(dist * 10) / 10
    }

    fetchBranchProducts()
  }

  // Active delivery eligibility for currently selected branch
  const deliveryStatus = computed(() => {
    return checkDeliveryEligibility(selectedBranch.value, userCoordinates.value, selectedCity.value)
  })

  function setCity(city) {
    selectedCity.value = city
    localStorage.setItem('selectedCity', city)
    const branchInCity = branches.find(b => b.city.toLowerCase() === city.toLowerCase())
    if (branchInCity) {
      setBranch(branchInCity)
    }
  }

  function setDeliveryAddress(addr) {
    deliveryAddress.value = addr
    localStorage.setItem('deliveryAddress', addr)
  }

  return {
    selectedBranch,
    selectedCity,
    userCoordinates,
    deliveryAddress,
    isLocating,
    locationError,
    detectedDistance,
    branchProducts,
    liveBranchProducts,
    deliveryStatus,
    MAX_DELIVERY_RADIUS_KM,
    fetchBranchProducts,
    findNearestBranch,
    detectLiveLocation,
    setBranch,
    setCity,
    setDeliveryAddress,
  }
})
