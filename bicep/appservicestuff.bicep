param AppName string

param DeployRedis bool = false
param DeployAppGateway bool = false
param CustomDomain string = ''
param Location string = resourceGroup().location
@secure()
param FrontendCertificatePfxBase64 string = ''
@secure()
param FrontendCertificatePassword string = ''

param Auth0__Audience string
param Auth0__Authority string
param CspPolicy string
param FrontendOptions__REACT_APP_AUTH_AUDIENCE string
param FrontendOptions__REACT_APP_AUTH_CLIENT_ID string
param FrontendOptions__REACT_APP_AUTH_DOMAIN string
param FrontendOptions__REACT_APP_AUTH_SCOPE string
param FrontendOptions__REACT_APP_BACKEND_URL string
param FrontendOptions__REACT_APP_SIGNALR_HUB_URL string

var appServiceName = '${AppName}-appservice'
var redisCacheName = '${AppName}-rediscache'
var serverFarmName = '${AppName}-asp'
var storageAccountName = '${AppName}storage'
var signalRRoleDefinitionId = '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/420fcaa2-552c-430f-98ca-3264be4806c7'
var storageDataContributorRoleDefinitionId = '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe'
var signalrServiceName = '${AppName}-signalr'

resource backendSignalRRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-08-01-preview' = {
  name: guid(resourceGroup().id, signalrServiceName, signalRRoleDefinitionId, 'foo')
  scope: signalrService
  properties: {
    principalId: reference(appService.id, '2018-02-01', 'Full').identity.principalId
    roleDefinitionId: signalRRoleDefinitionId
    principalType: 'ServicePrincipal'
  }
}

resource backendStorageAccountRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-08-01-preview' = {
  name: guid(resourceGroup().id, appServiceName, storageDataContributorRoleDefinitionId, 'foo')
  scope: storageAccount
  properties: {
    principalId: reference(appService.id, '2018-02-01', 'Full').identity.principalId
    roleDefinitionId: storageDataContributorRoleDefinitionId
    principalType: 'ServicePrincipal'
  }
}

module vnetModule 'modules/vnetModule.bicep' = {
  name: 'vnetModule'
  params: {
    AppName: AppName
    Location: Location
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: Location
  sku: {
    name: 'Standard_ZRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    isHnsEnabled: true
    minimumTlsVersion: 'TLS1_2'
  }
}

resource serverFarm 'Microsoft.Web/serverfarms@2020-12-01' = {
  location: Location
  name: serverFarmName
  kind: 'linux'
  properties: {
    targetWorkerSizeId: 6
    reserved: true
    targetWorkerCount: 1
  }
  sku: {
    tier: 'PremiumV3'
    name: 'P1V3'
  }
}

resource appService 'Microsoft.Web/sites@2020-12-01' = {
  name: appServiceName
  location: Location
  tags: {}
  identity: {
    type: 'SystemAssigned'
  }
  kind: 'app,linux'
  properties: {
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|6.0'
      httpLoggingEnabled: true
      detailedErrorLoggingEnabled: true
      appSettings: [
        {
          name: 'SignalRConnectionString'
          value: 'Endpoint=https://${signalrServiceName}.service.signalr.net;AuthType=aad;Version=1.0;'
        }
        {
          name: 'StorageAccountConnectionString'
          value: storageAccount.properties.primaryEndpoints.dfs
        }
        {
          name: 'Auth0__Audience'
          value: Auth0__Audience
        }
        {
          name: 'Auth0__Authority'
          value: Auth0__Authority
        }
        {
          name: 'CspPolicy'
          value: CspPolicy
        }
        {
          name: 'FrontendOptions__REACT_APP_AUTH_AUDIENCE'
          value: FrontendOptions__REACT_APP_AUTH_AUDIENCE
        }
        {
          name: 'FrontendOptions__REACT_APP_AUTH_CLIENT_ID'
          value: FrontendOptions__REACT_APP_AUTH_CLIENT_ID
        }
        {
          name: 'FrontendOptions__REACT_APP_AUTH_DOMAIN'
          value: FrontendOptions__REACT_APP_AUTH_DOMAIN
        }
        {
          name: 'FrontendOptions__REACT_APP_AUTH_SCOPE'
          value: FrontendOptions__REACT_APP_AUTH_SCOPE
        }
        {
          name: 'FrontendOptions__REACT_APP_BACKEND_URL'
          value: FrontendOptions__REACT_APP_BACKEND_URL
        }
        {
          name: 'FrontendOptions__REACT_APP_SIGNALR_HUB_URL'
          value: FrontendOptions__REACT_APP_SIGNALR_HUB_URL
        }
      ]
      webSocketsEnabled: true
      ftpsState: 'Disabled'
      http20Enabled: true
      use32BitWorkerProcess: false
      phpVersion: 'OFF'
      alwaysOn: true
    }
    serverFarmId: serverFarm.id
  }

  resource networkConfig 'networkConfig@2021-02-01' = {
    name: 'virtualNetwork'
    properties: {
      swiftSupported: true
      subnetResourceId: vnetModule.outputs.AppSubnetResourceId
    }
  }

  resource config 'config@2021-02-01' = {
    name: 'web'
    dependsOn: [
      networkConfig
    ]
    properties: {
      vnetRouteAllEnabled: true
    }
  }
}

module customDomain 'modules/customDomainModule.bicep' = if (length(CustomDomain) > 0) {
  name: 'customDomain'
  params: {
    AppServiceName: appService.name
    CustomDomain: CustomDomain
    ServerFarmId: serverFarm.id
    Location: Location
  }
}

module appGateway 'modules/appGatewayModule.bicep' = if (length(CustomDomain) > 0 && DeployAppGateway) {
  name: 'appGateway'
  dependsOn: [
    customDomain
  ]
  params: {
    AppServiceName: appService.name
    CustomDomain: CustomDomain
    FrontendCertificatePassword: FrontendCertificatePassword
    FrontendCertificatePfxBase64: FrontendCertificatePfxBase64
    Location: Location 
  }
}

resource redisCache 'Microsoft.Cache/redis@2020-06-01' = if (DeployRedis) {
  name: redisCacheName
  location: Location
  properties: {
    sku: {
      name: 'Basic'
      family: 'C'
      capacity: 0
    }
    enableNonSslPort: false
    publicNetworkAccess: 'Enabled'
    minimumTlsVersion: '1.2'
  }
}

resource signalrService 'Microsoft.SignalRService/signalR@2020-07-01-preview' = {
  location: Location
  name: signalrServiceName
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
        ]
      }
      privateEndpoints: []
    }
  }
}
