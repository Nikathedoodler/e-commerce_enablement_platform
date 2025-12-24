# DHL API Integration Research

**Date:** 2025-01-XX  
**Purpose:** Research DHL API options for shipping integration

---

## Available DHL APIs

### 1. **DHL Express API (MyDHL API)** ⭐ RECOMMENDED

**Best for:** Express international shipments, comprehensive shipping operations

**Features:**

- Service availability checking
- Transit time calculation
- Rate calculation
- Shipment booking
- Label generation
- Tracking
- Address validation

**Requirements:**

- Active DHL Express customer account
- Registration on DHL Developer Portal
- API credentials (Consumer Key & Secret)

**Endpoints:**

- **Sandbox:** `https://express.api.dhl.com/mydhlapi/test`
- **Production:** `https://express.api.dhl.com/mydhlapi`

**Authentication:** Basic Auth (Consumer Key + Consumer Secret)

**Documentation:** https://developer.dhl.com/api-reference/mydhl-api-dhl-express

---

### 2. **DHL eCommerce API**

**Best for:** E-commerce businesses with varying shipping volumes

**Features:**

- Label generation
- Rate calculation
- Tracking status retrieval

**Requirements:**

- Contact DHL eCommerce sales representative
- Receive: Client ID, Client Secret, Pickup Account Number, Distribution Center details

**Endpoints:**

- **Sandbox:** `https://api-sandbox.dhl.com`
- **Production:** `https://api.dhl.com`

**Authentication:** OAuth 2.0 or API Key (varies by service)

**Documentation:** https://www.dhl.com/us-en/home/ecommerce/business-help-center/data-integrations.html

---

### 3. **DHL Freight API**

**Best for:** Road freight shipments (Europe focus)

**Features:**

- Booking creation
- Label generation
- Tracking

**Note:** Less relevant for e-commerce fulfillment (more for freight)

---

## Third-Party Shipping Platforms (Alternative)

### Option A: ShipEngine

- Unified API for multiple carriers
- DHL Express integration available
- Easier setup, less control
- Pricing: Pay-per-use or subscription

### Option B: Shippo

- Multi-carrier shipping API
- DHL Express support
- Label generation, rates, tracking
- Pricing: Transaction-based

### Option C: AfterShip

- Focus on tracking and visibility
- Supports 1,200+ carriers including DHL
- Less suitable for label generation

---

## Recommendation: DHL Express API (MyDHL API)

**Why:**

1. ✅ Most comprehensive feature set
2. ✅ Direct integration (no third-party fees)
3. ✅ Full control over shipping operations
4. ✅ Best for international express shipping
5. ✅ Well-documented REST API
6. ✅ Sandbox environment for testing

**Next Steps:**

1. Register on DHL Developer Portal: https://developer.dhl.com/user/register
2. Create an application to get API credentials
3. Request sandbox access for testing
4. Review API documentation for endpoints we need:
   - Rate calculation endpoint
   - Shipment creation/label generation endpoint
   - Tracking endpoint (optional for now)

---

## Implementation Plan

### Phase 1: Setup & Authentication

- [ ] Register DHL Developer account
- [ ] Create application and get credentials
- [ ] Set up environment variables for sandbox
- [ ] Test authentication

### Phase 2: Rate Calculation

- [ ] Implement rate calculation endpoint wrapper
- [ ] Map our ShippingAddress to DHL format
- [ ] Handle DHL rate response
- [ ] Test with sandbox

### Phase 3: Label Generation

- [ ] Implement label generation endpoint wrapper
- [ ] Handle PDF label response
- [ ] Store labels in Supabase Storage
- [ ] Save metadata to shipping_labels table
- [ ] Test with sandbox

### Phase 4: Production

- [ ] Request production API access
- [ ] Update credentials
- [ ] Test with real shipments
- [ ] Monitor and handle errors

---

## Environment Variables Needed

```env
# DHL API Credentials (Sandbox)
DHL_API_KEY=your_consumer_key
DHL_API_SECRET=your_consumer_secret
DHL_API_BASE_URL=https://express.api.dhl.com/mydhlapi/test

# DHL API Credentials (Production - later)
# DHL_API_BASE_URL=https://express.api.dhl.com/mydhlapi

# Warehouse/Origin Address (for rate/label requests)
DHL_ORIGIN_COUNTRY=GE
DHL_ORIGIN_CITY=Kutaisi
DHL_ORIGIN_POSTAL_CODE=4600
DHL_ORIGIN_ADDRESS=Your Warehouse Address
DHL_ORIGIN_NAME=Your Company Name
DHL_ORIGIN_PHONE=+995...
```

---

## API Endpoints We'll Need

### 1. Rate Calculation

- **Endpoint:** `POST /rates`
- **Purpose:** Get shipping rates for an order
- **Input:** Origin, destination, package details
- **Output:** Available services with prices

### 2. Shipment Creation (Label Generation)

- **Endpoint:** `POST /shipments`
- **Purpose:** Create shipment and generate label
- **Input:** Full shipment details
- **Output:** Label PDF, tracking number, cost

### 3. Tracking (Future)

- **Endpoint:** `GET /tracking/{trackingNumber}`
- **Purpose:** Get shipment tracking status
- **Input:** Tracking number
- **Output:** Current status, location, events

---

## Notes

- DHL has daily API request limits (can request upgrade)
- Sandbox environment is free for testing
- Production access requires DHL Express account
- Consider rate limits and error handling
- Labels are typically returned as PDF (base64 or URL)

---

## Resources

- DHL Developer Portal: https://developer.dhl.com/
- MyDHL API Documentation: https://developer.dhl.com/api-reference/mydhl-api-dhl-express
- API Explorer: Available in developer portal for testing
