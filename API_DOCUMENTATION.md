# API Documentation - Stasiun Geofisika Mataram

Dokumentasi lengkap untuk RESTful API yang mendukung website Stasiun Geofisika Mataram dengan arsitektur Jamstack modern.

## 🏗️ Arsitektur API

### Base URL
```
Production: https://api.geofisika-mataram.bmkg.go.id/v1
Staging: https://staging-api.geofisika-mataram.bmkg.go.id/v1
Development: http://localhost:8000/api/v1
```

### Authentication
```http
Authorization: Bearer <API_KEY>
X-API-Key: bmkg-geofisika-mataram
Content-Type: application/json
```

### Rate Limiting
- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 1000 requests/minute
- **WebSocket connections**: 10 concurrent connections per IP

## 📡 Real-time Data Endpoints

### WebSocket Connection
```javascript
const ws = new WebSocket('wss://ws.geofisika-mataram.bmkg.go.id');

// Message format
{
  "type": "earthquake|tsunami|magnetic|service_status|notification",
  "payload": { /* data object */ },
  "timestamp": "2026-01-27T14:32:15.123Z",
  "source": "SGM-MATARAM"
}
```

## 🌋 Earthquake API

### Get Latest Earthquake
```http
GET /earthquake/latest
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "20260127143215",
    "magnitude": 5.8,
    "depth": 15,
    "location": "87 km Barat Daya Mataram",
    "coordinates": {
      "latitude": -8.7833,
      "longitude": 115.8167
    },
    "time": "2026-01-27T14:32:15.000Z",
    "timezone": "WITA",
    "intensity": "V MMI",
    "source": "BMKG",
    "status": "reviewed",
    "tsunami_potential": false
  },
  "meta": {
    "last_updated": "2026-01-27T14:35:00.000Z",
    "data_source": "seismograf_mataram",
    "processing_time": 45
  }
}
```

### Get Earthquake History
```http
GET /earthquake/history?limit=50&offset=0&min_magnitude=3.0&start_date=2026-01-01&end_date=2026-01-27
```

**Query Parameters:**
- `limit` (integer, default: 20, max: 100): Number of records
- `offset` (integer, default: 0): Pagination offset
- `min_magnitude` (float, default: 0.0): Minimum magnitude filter
- `max_magnitude` (float): Maximum magnitude filter
- `start_date` (ISO date): Start date filter
- `end_date` (ISO date): End date filter
- `location` (string): Location filter (partial match)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "20260127143215",
      "magnitude": 5.8,
      "depth": 15,
      "location": "87 km Barat Daya Mataram",
      "coordinates": {
        "latitude": -8.7833,
        "longitude": 115.8167
      },
      "time": "2026-01-27T14:32:15.000Z",
      "tsunami_potential": false
    }
  ],
  "pagination": {
    "total": 247,
    "limit": 50,
    "offset": 0,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "query_time": 0.045,
    "filters_applied": ["min_magnitude", "date_range"]
  }
}
```

### Get Earthquake Statistics
```http
GET /earthquake/statistics?period=30d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "total_events": 247,
    "magnitude_distribution": {
      "1.0-1.9": 45,
      "2.0-2.9": 89,
      "3.0-3.9": 67,
      "4.0-4.9": 32,
      "5.0-5.9": 12,
      "6.0+": 2
    },
    "depth_distribution": {
      "shallow": 156,
      "intermediate": 78,
      "deep": 13
    },
    "daily_average": 8.2,
    "largest_event": {
      "magnitude": 6.1,
      "location": "Lombok Timur",
      "date": "2026-01-15T09:23:45.000Z"
    }
  }
}
```

## 🌊 Tsunami API

### Get Tsunami Status
```http
GET /tsunami/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "safe",
    "level": 0,
    "message": "Tidak ada potensi tsunami saat ini",
    "last_warning": null,
    "monitoring_stations": {
      "active": 12,
      "total": 15,
      "offline": ["CBT-03", "CBT-07", "CBT-12"]
    },
    "sea_level": {
      "current": 0.15,
      "normal_range": [-0.5, 0.5],
      "unit": "meters"
    }
  },
  "meta": {
    "last_updated": "2026-01-27T14:35:00.000Z",
    "update_interval": 60,
    "data_sources": ["cbt_sensors", "tide_gauges", "seismic_network"]
  }
}
```

### Get Tsunami Warnings
```http
GET /tsunami/warnings?active_only=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "TSU-20260115-001",
      "level": "watch",
      "issued_at": "2026-01-15T09:25:00.000Z",
      "expires_at": "2026-01-15T12:25:00.000Z",
      "status": "expired",
      "trigger_event": {
        "earthquake_id": "20260115092345",
        "magnitude": 7.2,
        "location": "Laut Flores"
      },
      "affected_areas": [
        "Pesisir Lombok",
        "Pesisir Sumbawa",
        "Gili Islands"
      ],
      "estimated_arrival": {
        "lombok": "2026-01-15T10:15:00.000Z",
        "sumbawa": "2026-01-15T10:30:00.000Z"
      },
      "wave_height_estimate": {
        "min": 0.5,
        "max": 2.0,
        "unit": "meters"
      }
    }
  ]
}
```

## 🧭 Magnetic Field API

### Get Current Magnetic Data
```http
GET /magnetic/current
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-01-27T14:35:00.000Z",
    "components": {
      "x": 39245.67,
      "y": 1234.56,
      "z": -2345.78,
      "h": 39264.12,
      "d": 1.805,
      "i": -3.421,
      "f": 45678.90
    },
    "units": {
      "x": "nT",
      "y": "nT", 
      "z": "nT",
      "h": "nT",
      "d": "degrees",
      "i": "degrees",
      "f": "nT"
    },
    "quality": {
      "grade": "A",
      "confidence": 0.98,
      "noise_level": "low"
    },
    "activity_level": "quiet",
    "k_index": 2,
    "dst_index": -15
  },
  "meta": {
    "station": "SGM-MATARAM",
    "instrument": "LEMI-417",
    "sampling_rate": "1Hz",
    "last_calibration": "2026-01-01T00:00:00.000Z"
  }
}
```

### Get Magnetic History
```http
GET /magnetic/history?start_date=2026-01-26&end_date=2026-01-27&resolution=1h
```

**Query Parameters:**
- `start_date` (ISO date, required): Start date
- `end_date` (ISO date, required): End date
- `resolution` (string): Data resolution (1m, 5m, 1h, 1d)
- `components` (array): Specific components to return

**Response:**
```json
{
  "success": true,
  "data": {
    "resolution": "1h",
    "components": ["h", "d", "z", "f"],
    "timestamps": [
      "2026-01-26T00:00:00.000Z",
      "2026-01-26T01:00:00.000Z"
    ],
    "values": {
      "h": [39264.12, 39265.34],
      "d": [1.805, 1.807],
      "z": [-2345.78, -2346.12],
      "f": [45678.90, 45679.45]
    }
  },
  "pagination": {
    "total_points": 48,
    "returned": 48
  }
}
```

## ⏰ Time Service API

### Get NTP Status
```http
GET /ntp/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "server_time": "2026-01-27T14:35:00.123456Z",
    "timezone": "Asia/Makassar",
    "local_time": "2026-01-27T22:35:00.123456+08:00",
    "accuracy": {
      "value": 1.2,
      "unit": "microseconds"
    },
    "stratum": 1,
    "reference_clock": "GPS",
    "uptime": 2592000,
    "sync_status": "synchronized",
    "clients_connected": 45,
    "requests_per_second": 120
  }
}
```

## 🏗️ Engineering Seismology API

### Get Structure Monitoring
```http
GET /engineering/structures
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "STR-001",
      "name": "Gedung BMKG Mataram",
      "type": "building",
      "location": {
        "latitude": -8.5833,
        "longitude": 116.1167
      },
      "sensors": [
        {
          "id": "ACC-001",
          "type": "accelerometer",
          "position": "basement",
          "status": "active",
          "last_data": "2026-01-27T14:35:00.000Z"
        },
        {
          "id": "ACC-002", 
          "type": "accelerometer",
          "position": "roof",
          "status": "active",
          "last_data": "2026-01-27T14:35:00.000Z"
        }
      ],
      "health_status": "good",
      "last_significant_motion": "2026-01-15T09:23:45.000Z"
    }
  ]
}
```

### Get Structure Response Data
```http
GET /engineering/structures/{structure_id}/response?event_id=20260115092345
```

**Response:**
```json
{
  "success": true,
  "data": {
    "structure_id": "STR-001",
    "event_id": "20260115092345",
    "trigger_time": "2026-01-15T09:23:45.000Z",
    "duration": 120,
    "peak_ground_acceleration": {
      "x": 0.15,
      "y": 0.12,
      "z": 0.08,
      "unit": "g"
    },
    "structural_response": {
      "max_displacement": 2.3,
      "max_velocity": 15.6,
      "max_acceleration": 0.18,
      "fundamental_frequency": 2.1,
      "damping_ratio": 0.05
    },
    "damage_assessment": "none",
    "response_spectrum": {
      "periods": [0.1, 0.2, 0.3, 0.5, 1.0, 2.0],
      "accelerations": [0.12, 0.15, 0.18, 0.14, 0.08, 0.04]
    }
  }
}
```

## 📊 System Status API

### Get All Services Status
```http
GET /status/all
```

**Response:**
```json
{
  "success": true,
  "data": {
    "earthquake": {
      "status": "normal",
      "uptime": 99.8,
      "last_check": "2026-01-27T14:35:00.000Z",
      "response_time": 45,
      "active_sensors": 8,
      "total_sensors": 10
    },
    "tsunami": {
      "status": "safe", 
      "uptime": 99.5,
      "last_check": "2026-01-27T14:35:00.000Z",
      "response_time": 32,
      "active_sensors": 12,
      "total_sensors": 15
    },
    "magnetic": {
      "status": "stable",
      "uptime": 99.9,
      "last_check": "2026-01-27T14:35:00.000Z",
      "response_time": 28,
      "data_quality": "excellent"
    },
    "ntp": {
      "status": "sync",
      "uptime": 100.0,
      "last_check": "2026-01-27T14:35:00.000Z",
      "accuracy": 1.2,
      "clients": 45
    },
    "engineering": {
      "status": "active",
      "uptime": 98.7,
      "last_check": "2026-01-27T14:35:00.000Z",
      "monitored_structures": 12,
      "active_sensors": 48
    }
  },
  "meta": {
    "overall_health": "excellent",
    "last_incident": "2026-01-20T03:15:00.000Z",
    "next_maintenance": "2026-02-01T02:00:00.000Z"
  }
}
```

### Get Service Health
```http
GET /status/{service}
```

**Path Parameters:**
- `service`: earthquake|tsunami|magnetic|ntp|engineering

## 🔔 Notifications API

### Get Notifications
```http
GET /notifications?limit=20&type=earthquake&unread_only=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "NOTIF-20260127-001",
      "type": "earthquake",
      "priority": "high",
      "title": "Gempa M 5.8 Terdeteksi",
      "message": "Gempa bumi magnitude 5.8 terdeteksi di 87 km Barat Daya Mataram",
      "timestamp": "2026-01-27T14:32:15.000Z",
      "read": false,
      "data": {
        "earthquake_id": "20260127143215",
        "magnitude": 5.8,
        "location": "87 km Barat Daya Mataram"
      },
      "actions": [
        {
          "type": "view_details",
          "url": "/earthquake/20260127143215"
        }
      ]
    }
  ],
  "pagination": {
    "total": 15,
    "unread": 3,
    "limit": 20,
    "offset": 0
  }
}
```

### Mark Notification as Read
```http
PATCH /notifications/{notification_id}/read
```

### Subscribe to Push Notifications
```http
POST /notifications/subscribe
```

**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  },
  "preferences": {
    "earthquake": {
      "enabled": true,
      "min_magnitude": 4.0
    },
    "tsunami": {
      "enabled": true,
      "all_levels": true
    },
    "system": {
      "enabled": false
    }
  }
}
```

## 📈 Analytics API

### Get Usage Statistics
```http
GET /analytics/usage?period=7d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "7d",
    "total_requests": 125430,
    "unique_visitors": 8945,
    "top_endpoints": [
      {
        "endpoint": "/earthquake/latest",
        "requests": 45230,
        "percentage": 36.1
      },
      {
        "endpoint": "/tsunami/status", 
        "requests": 23450,
        "percentage": 18.7
      }
    ],
    "geographic_distribution": {
      "indonesia": 78.5,
      "international": 21.5
    },
    "device_types": {
      "mobile": 65.2,
      "desktop": 28.3,
      "tablet": 6.5
    }
  }
}
```

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "EARTHQUAKE_NOT_FOUND",
    "message": "Earthquake with ID 20260127143215 not found",
    "details": "The requested earthquake record does not exist in our database",
    "timestamp": "2026-01-27T14:35:00.000Z",
    "request_id": "req_abc123def456"
  },
  "meta": {
    "api_version": "v1",
    "documentation": "https://api.geofisika-mataram.bmkg.go.id/docs"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error
- `503` - Service Unavailable

### Error Codes
- `INVALID_API_KEY` - API key tidak valid
- `RATE_LIMIT_EXCEEDED` - Batas rate limit terlampaui
- `EARTHQUAKE_NOT_FOUND` - Data gempa tidak ditemukan
- `INVALID_DATE_RANGE` - Rentang tanggal tidak valid
- `SERVICE_UNAVAILABLE` - Layanan tidak tersedia
- `VALIDATION_ERROR` - Error validasi input
- `INTERNAL_ERROR` - Error internal server

## 🔐 Security

### API Key Management
```http
POST /auth/api-keys
Authorization: Bearer <admin_token>

{
  "name": "Mobile App v1.0",
  "permissions": ["earthquake:read", "tsunami:read"],
  "rate_limit": 1000,
  "expires_at": "2027-01-27T00:00:00.000Z"
}
```

### CORS Configuration
```
Access-Control-Allow-Origin: https://geofisika-mataram.bmkg.go.id
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-API-Key
Access-Control-Max-Age: 86400
```

### Content Security Policy
```
Content-Security-Policy: default-src 'self'; connect-src 'self' wss://ws.geofisika-mataram.bmkg.go.id
```

## 📚 SDK & Libraries

### JavaScript SDK
```javascript
import { GeofisikaAPI } from '@bmkg/geofisika-sdk';

const api = new GeofisikaAPI({
  baseURL: 'https://api.geofisika-mataram.bmkg.go.id/v1',
  apiKey: 'your-api-key'
});

// Get latest earthquake
const earthquake = await api.earthquake.getLatest();

// Subscribe to real-time updates
api.realtime.subscribe('earthquake', (data) => {
  console.log('New earthquake:', data);
});
```

### Python SDK
```python
from bmkg_geofisika import GeofisikaAPI

api = GeofisikaAPI(
    base_url='https://api.geofisika-mataram.bmkg.go.id/v1',
    api_key='your-api-key'
)

# Get earthquake history
earthquakes = api.earthquake.get_history(
    min_magnitude=4.0,
    start_date='2026-01-01',
    limit=50
)
```

## 🧪 Testing

### API Testing with curl
```bash
# Get latest earthquake
curl -H "X-API-Key: your-api-key" \
     https://api.geofisika-mataram.bmkg.go.id/v1/earthquake/latest

# Get tsunami status
curl -H "X-API-Key: your-api-key" \
     https://api.geofisika-mataram.bmkg.go.id/v1/tsunami/status
```

### Postman Collection
Import collection: `https://api.geofisika-mataram.bmkg.go.id/postman/collection.json`

## 📞 Support

- **API Documentation**: https://api.geofisika-mataram.bmkg.go.id/docs
- **Status Page**: https://status.geofisika-mataram.bmkg.go.id
- **Support Email**: api-support@bmkg.go.id
- **Developer Portal**: https://developer.bmkg.go.id

---

**API Version**: v1.0.0  
**Last Updated**: January 27, 2026  
**Maintained by**: BMKG - Stasiun Geofisika Mataram