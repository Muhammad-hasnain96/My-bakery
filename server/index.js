import { app } from './app.js'
import { testSmtpConnection } from './mailer.js'
import { isSupabaseConfigured } from './supabase.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`\n==================================================`)
  console.log(`🚀 My Bakery Backend API running on http://localhost:${PORT}`)
  console.log(`📦 Cloud Database: ${isSupabaseConfigured ? '⚡ SUPABASE CONNECTED' : '⚠️ Offline'}`)

  // Test SMTP connection on startup
  const smtpStatus = await testSmtpConnection()
  if (smtpStatus.connected) {
    console.log(`📧 Live SMTP: CONNECTED (${smtpStatus.message})`)
  } else {
    console.log(`📧 Live SMTP: PENDING CONFIGURATION (${smtpStatus.message})`)
  }
  console.log(`==================================================\n`)
})
