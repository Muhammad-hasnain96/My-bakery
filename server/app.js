import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { supabase, isSupabaseConfigured } from './supabase.js'
import { sendOtpEmail, testSmtpConnection, isSmtpConfigured } from './mailer.js'

dotenv.config()

export const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    database: isSupabaseConfigured ? 'supabase' : 'sqlite',
  })
})

// Check SMTP connection status
app.get('/api/smtp/status', async (req, res) => {
  try {
    const status = await testSmtpConnection()
    res.json({
      configured: isSmtpConfigured,
      ...status,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── 1. Branches API ───────────────────────────────────────────────────────────
app.get('/api/branches', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('branches').select('*')
      if (error) throw error
      const mapped = (data || []).map(r => ({
        id: r.id,
        city: r.city,
        name: r.name,
        address: r.address,
        phone: r.phone,
        hours: r.hours,
        mapUrl: r.mapUrl,
        coords: { lat: r.lat, lng: r.lng },
      }))
      return res.json(mapped)
    }
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── 2. Categories API ────────────────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('categories').select('*')
      if (error) throw error
      return res.json(data || [])
    }
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── 3. Products API ───────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { branchId, category } = req.query

    if (supabase) {
      let q = supabase.from('products').select('*')
      if (category && category !== 'all') {
        q = q.eq('category', category)
      }
      const { data: rows, error } = await q
      if (error) throw error

      // Get branch inventory if branchId specified
      const inventoryMap = {}
      if (branchId) {
        const { data: invRows } = await supabase
          .from('branch_inventory')
          .select('productId, isAvailable, stockCount')
          .eq('branchId', branchId)

        if (invRows) {
          invRows.forEach(inv => {
            inventoryMap[inv.productId] = inv
          })
        }
      }

      const formatted = (rows || []).map(r => {
        let branchIds = []
        try {
          branchIds = typeof r.branchIds === 'string' ? JSON.parse(r.branchIds || '[]') : (r.branchIds || [])
        } catch {
          branchIds = []
        }
        const inv = inventoryMap[r.id]
        const isAvailable = inv ? inv.isAvailable === 1 : true

        return {
          ...r,
          isFeatured: Boolean(r.isFeatured),
          isBestSeller: Boolean(r.isBestSeller),
          isDeal: Boolean(r.isDeal),
          branchIds,
          isAvailable,
          outOfStock: !isAvailable,
        }
      })

      if (branchId) {
        const filtered = formatted.filter(p => !p.branchIds.length || p.branchIds.includes(branchId))
        return res.json(filtered)
      }

      return res.json(formatted)
    }
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── 4. Orders API ────────────────────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const {
      orderNumber,
      customer,
      orderType,
      fulfillingBranch,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      distanceKm,
      notes,
    } = req.body

    if (!orderNumber || !customer?.name || !customer?.phone || !fulfillingBranch?.name) {
      return res.status(400).json({ error: 'Missing required order fields' })
    }

    // 10 KM Delivery Radius & Out-of-City Boundary Enforcement
    if (orderType === 'Delivery') {
      const branchCity = (fulfillingBranch.city || '').toLowerCase().trim()
      const customerCity = (customer.city || '').toLowerCase().trim()

      // Reject cross-city deliveries (e.g. Faisalabad branch delivering to Lahore)
      if (branchCity && customerCity && branchCity !== customerCity) {
        return res.status(400).json({
          error: `Delivery unavailable: ${fulfillingBranch.name} is in ${fulfillingBranch.city} and cannot deliver out of city to ${customer.city}. Please select Store Pickup or a branch in ${customer.city}.`
        })
      }

      // Reject deliveries exceeding 10 km
      if (distanceKm !== undefined && distanceKm !== null && Number(distanceKm) > 10.0) {
        return res.status(400).json({
          error: `Delivery radius exceeded: Your location is ${distanceKm} km away. Maximum allowed delivery range is 10 km from ${fulfillingBranch.name}. Please select Store Pickup instead.`
        })
      }
    }

    if (supabase) {
      const orderData = {
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email || null,
        customerPhone: customer.phone,
        customerAddress: customer.address || '',
        customerCity: customer.city || fulfillingBranch.city || 'Faisalabad',
        orderType: orderType || 'Delivery',
        branchId: fulfillingBranch.id || 'fsd-kohinoor',
        branchName: fulfillingBranch.name,
        branchAddress: fulfillingBranch.address || '',
        itemsJson: JSON.stringify(items || []),
        subtotal: subtotal || 0,
        deliveryFee: deliveryFee || 0,
        discount: discount || 0,
        total: total || 0,
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: paymentMethod === 'card' ? 'Paid' : 'Pending',
        orderStatus: 'Received',
        distanceKm: distanceKm || null,
        notes: notes || '',
      }

      const { data: savedOrder, error } = await supabase.from('orders').insert(orderData).select().single()
      if (error) throw error

      console.log(`🎉 [ORDER RECORDED IN SUPABASE] ${orderNumber} for ${customer.name} at branch: ${fulfillingBranch.name} | Total: Rs. ${total}`)

      savedOrder.items = JSON.parse(savedOrder.itemsJson || '[]')
      return res.status(201).json({
        success: true,
        message: 'Order placed and saved to Supabase cloud!',
        order: savedOrder,
      })
    }

    res.status(500).json({ error: 'Supabase database not connected' })
  } catch (err) {
    console.error('Error placing order:', err)
    res.status(500).json({ error: err.message })
  }
})

// Fetch single order by orderNumber
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    if (supabase) {
      const { data: order, error } = await supabase.from('orders').select('*').eq('orderNumber', req.params.orderNumber).single()
      if (error || !order) return res.status(404).json({ error: 'Order not found' })
      order.items = JSON.parse(order.itemsJson || '[]')
      return res.json(order)
    }
    res.status(404).json({ error: 'Database offline' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── 5. Kitchen & Admin Portal API ───────────────────────────────────────────
app.get('/api/admin/orders', async (req, res) => {
  try {
    const { branchId, status, search } = req.query

    if (supabase) {
      let query = supabase.from('orders').select('*').order('id', { ascending: false })

      if (branchId && branchId !== 'all') {
        query = query.eq('branchId', branchId)
      }

      if (status && status !== 'all') {
        query = query.eq('orderStatus', status)
      }

      if (search && search.trim()) {
        const term = `%${search.trim()}%`
        query = query.or(`orderNumber.ilike.${term},customerName.ilike.${term},customerPhone.ilike.${term}`)
      }

      const { data: rows, error } = await query
      if (error) throw error

      const orders = (rows || []).map(r => ({
        ...r,
        items: JSON.parse(r.itemsJson || '[]'),
      }))

      return res.json(orders)
    }
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update order status
app.patch('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body
    const { id } = req.params

    if (supabase) {
      const updates = {}
      if (status) updates.orderStatus = status
      if (paymentStatus) updates.paymentStatus = paymentStatus

      const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select().single()
      if (error) throw error

      console.log(`📢 [ORDER STATUS UPDATED] ID: ${id} -> Status: ${status} | Payment: ${paymentStatus || 'Unchanged'}`)
      data.items = JSON.parse(data.itemsJson || '[]')
      return res.json({ success: true, order: data })
    }
    res.status(500).json({ error: 'Database offline' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Thermal Slip Endpoint
app.get('/api/admin/orders/:id/slip', async (req, res) => {
  try {
    const { id } = req.params
    if (supabase) {
      const { data: order, error } = await supabase.from('orders').select('*').eq('id', id).single()
      if (error || !order) return res.status(404).json({ error: 'Order not found' })

      order.items = JSON.parse(order.itemsJson || '[]')
      return res.json({
        slipHeader: {
          storeName: 'MY BAKERY 🥐',
          tagline: 'Artisanal Bakes & Confections',
          branch: order.branchName,
          branchAddress: order.branchAddress,
        },
        orderInfo: {
          orderNumber: order.orderNumber,
          date: order.createdAt,
          type: order.orderType,
          status: order.orderStatus,
        },
        customer: {
          name: order.customerName,
          phone: order.customerPhone,
          address: order.customerAddress,
          city: order.customerCity,
          distance: order.distanceKm ? `${order.distanceKm} km` : 'N/A',
        },
        items: order.items.map(it => ({
          name: it.name,
          quantity: it.quantity,
          unitPrice: it.price,
          total: it.price * it.quantity,
        })),
        summary: {
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          discount: order.discount,
          grandTotal: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
        },
        notes: order.notes,
        footer: 'Thank you for ordering with My Bakery! Freshly Baked Daily.',
      })
    }
    res.status(404).json({ error: 'Database offline' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Toggle product stock for a branch
app.patch('/api/admin/products/:id/branch-stock', async (req, res) => {
  try {
    const { id } = req.params
    const { branchId, isAvailable, stockCount } = req.body

    if (!branchId) {
      return res.status(400).json({ error: 'branchId is required' })
    }

    if (supabase) {
      const { data, error } = await supabase.from('branch_inventory').upsert({
        branchId,
        productId: parseInt(id, 10),
        isAvailable: isAvailable ? 1 : 0,
        stockCount: stockCount !== undefined ? stockCount : 50,
        updatedAt: new Date().toISOString(),
      }).select().single()

      if (error) throw error

      console.log(`📦 [BRANCH INVENTORY] Branch: ${branchId} | Product: ${id} -> Available: ${isAvailable}`)
      return res.json({ success: true, inventory: data })
    }
    res.status(500).json({ error: 'Database offline' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Products CRUD
app.get('/api/admin/products', async (req, res) => {
  try {
    const { branchId, category } = req.query
    if (supabase) {
      let q = supabase.from('products').select('*')
      if (category && category !== 'all') q = q.eq('category', category)
      const { data: rows, error } = await q
      if (error) throw error

      const inventoryMap = {}
      if (branchId) {
        const { data: invRows } = await supabase.from('branch_inventory').select('*').eq('branchId', branchId)
        if (invRows) {
          invRows.forEach(inv => { inventoryMap[inv.productId] = inv })
        }
      }

      const formatted = (rows || []).map(r => {
        let branchIds = []
        try {
          branchIds = typeof r.branchIds === 'string' ? JSON.parse(r.branchIds || '[]') : (r.branchIds || [])
        } catch {
          branchIds = []
        }
        const inv = inventoryMap[r.id]
        const isAvailable = inv ? inv.isAvailable === 1 : true
        return {
          ...r,
          isFeatured: Boolean(r.isFeatured),
          isBestSeller: Boolean(r.isBestSeller),
          isDeal: Boolean(r.isDeal),
          branchIds,
          isAvailable,
          stockCount: inv ? inv.stockCount : 50,
        }
      })
      return res.json(formatted)
    }
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    if (supabase) {
      const { data: orders } = await supabase.from('orders').select('*')
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
      const { count: branchCount } = await supabase.from('branches').select('*', { count: 'exact', head: true })

      const orderList = orders || []
      const totalRevenue = orderList.filter(o => o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0)
      const received = orderList.filter(o => o.orderStatus === 'Received').length
      const preparing = orderList.filter(o => o.orderStatus === 'Preparing').length
      const dispatched = orderList.filter(o => o.orderStatus === 'Dispatched').length
      const delivered = orderList.filter(o => o.orderStatus === 'Delivered').length

      return res.json({
        totalOrders: orderList.length,
        totalRevenue,
        activeOrders: received + preparing + dispatched,
        statusCounts: { received, preparing, dispatched, delivered },
        totalProducts: productCount || 24,
        totalBranches: branchCount || 8,
      })
    }
    res.json({})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Staff Directory
app.get('/api/admin/staff', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('users').select('id, name, email, phone, role, branchId, branchName, createdAt').order('id', { ascending: true })
      if (error) throw error
      return res.json(data || [])
    }
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── 6. Authentication API ───────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email.trim())
        .single()

      if (error || !user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'customer',
        branchId: user.branchId || null,
        branchName: user.branchName || null,
        createdAt: user.createdAt,
      }

      console.log(`🔑 [USER LOGGED IN] ${safeUser.name} (${safeUser.email}) | Role: ${safeUser.role}`)
      return res.json({ success: true, message: 'Login successful!', user: safeUser })
    }
    res.status(500).json({ error: 'Database offline' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (supabase) {
      const cleanEmail = email.toLowerCase().trim()
      const { data: existing } = await supabase.from('users').select('id').ilike('email', cleanEmail).maybeSingle()
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' })
      }

      const { data: newUser, error } = await supabase.from('users').insert({
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        password,
        role: 'customer',
      }).select().single()

      if (error) throw error

      const safeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt,
      }

      console.log(`🎉 [NEW USER REGISTERED] ${safeUser.name} (${safeUser.email})`)
      return res.status(201).json({ success: true, message: 'Account registered successfully!', user: safeUser })
    }
    res.status(500).json({ error: 'Database offline' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── 7. Email OTP Order Confirmation API ─────────────────────────────────────
app.post('/api/otp/send', async (req, res) => {
  try {
    const { email, customerName, orderTotal } = req.body
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' })
    }

    const cleanEmail = email.toLowerCase().trim()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 5 * 60 * 1000

    if (supabase) {
      await supabase.from('otps').upsert({
        email: cleanEmail,
        code,
        expiresAt,
        attempts: 0,
      })
    }

    console.log(`\n=============================================================`)
    console.log(`📬 [EMAIL OTP DISPATCH TRIGGERED]`)
    console.log(`To:           ${cleanEmail} (${customerName || 'Customer'})`)
    console.log(`Subject:      🔐 My Bakery — Order Confirmation Code: ${code}`)
    console.log(`Code:         ${code}`)
    console.log(`Order Total:  Rs. ${orderTotal ? orderTotal.toLocaleString() : 'N/A'}`)
    console.log(`Validity:     5 minutes (Expires at ${new Date(expiresAt).toLocaleTimeString()})`)

    let mailResult = { sent: false, mode: 'simulation' }
    try {
      mailResult = await sendOtpEmail({
        to: cleanEmail,
        customerName: customerName || 'Valued Customer',
        code,
        orderTotal,
      })
      console.log(`Delivery Mode: ${mailResult.mode.toUpperCase()} | Sent: ${mailResult.sent}`)
    } catch (mailErr) {
      console.warn(`⚠️ [MAIL DELIVERY WARNING]:`, mailErr.message)
    }
    console.log(`=============================================================\n`)

    res.json({
      success: true,
      message: mailResult.sent
        ? `A 6-digit confirmation code has been emailed to ${cleanEmail}`
        : `Confirmation code generated for ${cleanEmail}`,
      email: cleanEmail,
      liveEmailSent: mailResult.sent,
      testCode: code,
      expiresAt,
    })
  } catch (err) {
    console.error('Error sending OTP:', err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/otp/verify', async (req, res) => {
  try {
    const { email, code } = req.body
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' })
    }

    const cleanEmail = email.toLowerCase().trim()
    const cleanCode = code.toString().trim()

    if (supabase) {
      const { data: row, error } = await supabase.from('otps').select('*').ilike('email', cleanEmail).maybeSingle()
      if (error || !row) {
        return res.status(400).json({ error: 'No active verification code found for this email. Please request a new one.' })
      }

      if (Date.now() > row.expiresAt) {
        await supabase.from('otps').delete().ilike('email', cleanEmail)
        return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' })
      }

      if (row.attempts >= 5) {
        await supabase.from('otps').delete().ilike('email', cleanEmail)
        return res.status(429).json({ error: 'Too many incorrect attempts. Please request a fresh OTP.' })
      }

      if (row.code !== cleanCode) {
        await supabase.from('otps').update({ attempts: row.attempts + 1 }).ilike('email', cleanEmail)
        const remaining = 4 - row.attempts
        return res.status(400).json({ error: `Incorrect verification code. ${remaining > 0 ? remaining + ' attempts remaining.' : 'Code locked.'}` })
      }

      // Valid OTP: consume it
      await supabase.from('otps').delete().ilike('email', cleanEmail)
      console.log(`✅ [OTP VERIFIED] Customer ${cleanEmail} successfully verified order!`)

      return res.json({
        success: true,
        verified: true,
        message: 'Email confirmed successfully! Placing order...',
      })
    }
    res.status(500).json({ error: 'Database offline' })
  } catch (err) {
    console.error('Error verifying OTP:', err)
    res.status(500).json({ error: err.message })
  }
})

export default app

