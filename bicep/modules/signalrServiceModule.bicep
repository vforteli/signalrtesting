param Location string
param SignalRServiceName string

resource signalrService 'Microsoft.SignalRService/signalR@2020-07-01-preview' = {
  location: Location
  name: SignalRServiceName
  sku: {
    name: 'Free_F1'
    tier: 'Free'
    capacity: 1
  }
  kind: 'SignalR'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    tls: {
      clientCertEnabled: false
    }
    features: [
      {
        flag: 'ServiceMode'
        value: 'Default'
        properties: {}
      }
      {
        flag: 'EnableConnectivityLogs'
        value: 'True'
        properties: {}
      }
      {
        flag: 'EnableMessagingLogs'
        value: 'False'
        properties: {}
      }
    ]
    cors: {
      allowedOrigins: [
        '*'
      ]
    }
    upstream: {}
    networkACLs: {
      defaultAction: 'Deny'
      publicNetwork: {
        allow: [
          'ServerConnection'
          'ClientConnection'
          'RESTAPI'
        ]
      }
      privateEndpoints: []
    }
  }
}
